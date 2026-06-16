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

    // 2. NEW: Doctor Workload Allocation
    const doctorWorkload = await executeQuery(`
      SELECT d.name AS DOCTOR, COUNT(a.appointment_id) AS APPOINTMENTS
      FROM doctors d
      LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
      GROUP BY d.name
      ORDER BY APPOINTMENTS DESC
      FETCH FIRST 5 ROWS ONLY
    `);

    // 3. NEW: Inventory Categorization Levels
    const stockDistribution = await executeQuery(`
      SELECT 
        CASE WHEN quantity < 20 THEN 'LOW STOCK' ELSE 'AVAILABLE' END AS CATEGORY,
        COUNT(*) AS ITEM_COUNT
      FROM inventory
      GROUP BY CASE WHEN quantity < 20 THEN 'LOW STOCK' ELSE 'AVAILABLE' END
    `);

    // 4. NEW: Revenue Financial Status Breakdown
    const revenueBreakdown = await executeQuery(`
      SELECT status AS STATUS_KEY, SUM(total_amount) AS SUM_AMOUNT
      FROM billing
      GROUP BY status
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
      }))
    });

  } catch (error: any) {
    console.error("Dashboard Backend Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}