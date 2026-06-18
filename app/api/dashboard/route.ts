import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // Basic summary counters
    const pCount = await executeQuery("SELECT COUNT(*) AS TOTAL FROM patients");
    const dCount = await executeQuery("SELECT COUNT(*) AS TOTAL FROM doctors");
    const aCount = await executeQuery("SELECT COUNT(*) AS TOTAL FROM appointments");
    const rCount = await executeQuery("SELECT NVL(SUM(total_amount), 0) AS TOTAL FROM billing");

    // Lists
    const latestPatients = await executeQuery(`
      SELECT patient_id, name, phone FROM patients ORDER BY patient_id DESC FETCH FIRST 5 ROWS ONLY
    `);
    const latestDoctors = await executeQuery(`
      SELECT doctor_id, name, specialization FROM doctors ORDER BY doctor_id DESC FETCH FIRST 5 ROWS ONLY
    `);

    // 1. Monthly Patient Registrations Trend
    const monthlyPatients = await executeQuery(`
      SELECT TO_CHAR(created_at, 'MON') AS MONTH, COUNT(*) AS PATIENTS, MIN(created_at) AS sort_key
      FROM patients GROUP BY TO_CHAR(created_at, 'MON') ORDER BY sort_key ASC
    `);

    // 2. Doctor Workload Allocation
    const doctorWorkload = await executeQuery(`
      SELECT d.name AS DOCTOR, COUNT(a.appointment_id) AS APPOINTMENTS
      FROM doctors d
      LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
      GROUP BY d.name
      ORDER BY APPOINTMENTS DESC
      FETCH FIRST 5 ROWS ONLY
    `);

    // 3. Inventory Categorization Levels (3 tiers)
    const stockDistribution = await executeQuery(`
      SELECT 
        CASE 
          WHEN quantity = 0 THEN 'Out of Stock'
          WHEN quantity < 20 THEN 'Low Stock'
          ELSE 'In Stock'
        END AS CATEGORY,
        COUNT(*) AS ITEM_COUNT
      FROM inventory
      GROUP BY CASE 
        WHEN quantity = 0 THEN 'Out of Stock'
        WHEN quantity < 20 THEN 'Low Stock'
        ELSE 'In Stock'
      END
    `);

    // 4. Revenue Financial Status Breakdown
    const revenueBreakdown = await executeQuery(`
      SELECT status AS STATUS_KEY, SUM(total_amount) AS SUM_AMOUNT
      FROM billing
      GROUP BY status
    `);

    // 5. Appointments by Status (for donut chart)
    const appointmentsByStatus = await executeQuery(`
      SELECT status AS STATUS, COUNT(*) AS TOTAL
      FROM appointments
      GROUP BY status
    `);

    // 6. Appointments trend by month
    const appointmentTrend = await executeQuery(`
      SELECT TO_CHAR(appointment_date, 'MON') AS MONTH, COUNT(*) AS TOTAL, MIN(appointment_date) AS sort_key
      FROM appointments
      GROUP BY TO_CHAR(appointment_date, 'MON')
      ORDER BY sort_key ASC
    `);

    // 7. Gender distribution of patients
    const genderDistribution = await executeQuery(`
      SELECT gender AS GENDER, COUNT(*) AS TOTAL
      FROM patients
      GROUP BY gender
    `);

    // 8. Top billed patients
    const topBilledPatients = await executeQuery(`
      SELECT p.name AS PATIENT, SUM(b.total_amount) AS TOTAL
      FROM billing b
      JOIN patients p ON b.patient_id = p.patient_id
      GROUP BY p.name
      ORDER BY TOTAL DESC
      FETCH FIRST 5 ROWS ONLY
    `);

    // 9. Doctors by specialization
    const doctorsBySpecialization = await executeQuery(`
      SELECT specialization AS SPECIALIZATION, COUNT(*) AS TOTAL
      FROM doctors
      GROUP BY specialization
      ORDER BY TOTAL DESC
    `);

    return NextResponse.json({
      totalPatients: pCount[0]?.TOTAL || 0,
      totalDoctors: dCount[0]?.TOTAL || 0,
      totalAppointments: aCount[0]?.TOTAL || 0,
      totalRevenue: Number(rCount[0]?.TOTAL || 0),
      latestPatients,
      latestDoctors,
      monthlyPatients: monthlyPatients.map((item: any) => ({
        month: item.MONTH,
        patients: Number(item.PATIENTS),
      })),
      doctorWorkload: doctorWorkload.map((w: any) => ({
        doctor: w.DOCTOR,
        appointments: Number(w.APPOINTMENTS)
      })),
      stockData: stockDistribution.map((s: any) => ({
        name: s.CATEGORY,
        value: Number(s.ITEM_COUNT)
      })),
      revenueStatus: revenueBreakdown.map((r: any) => ({
        status: r.STATUS_KEY,
        amount: Number(r.SUM_AMOUNT)
      })),
      appointmentsByStatus: appointmentsByStatus.map((a: any) => ({
        status: a.STATUS,
        total: Number(a.TOTAL)
      })),
      appointmentTrend: appointmentTrend.map((a: any) => ({
        month: a.MONTH,
        appointments: Number(a.TOTAL)
      })),
      genderDistribution: genderDistribution.map((g: any) => ({
        name: g.GENDER,
        value: Number(g.TOTAL)
      })),
      topBilledPatients: topBilledPatients.map((p: any) => ({
        patient: p.PATIENT,
        total: Number(p.TOTAL)
      })),
      doctorsBySpecialization: doctorsBySpecialization.map((d: any) => ({
        specialization: d.SPECIALIZATION,
        total: Number(d.TOTAL)
      })),
    });

  } catch (error: any) {
    console.error("Dashboard Backend Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}