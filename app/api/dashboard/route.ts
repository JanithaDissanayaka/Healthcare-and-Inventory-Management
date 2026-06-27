import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // 1. COMBINED SUMMARY COUNTS (Using Scalar Subqueries)
    // Consolidates 4 separate DB calls into a single call using the DUAL table
    const summaryQuery = `
      SELECT 
        (SELECT COUNT(*) FROM patients) AS total_patients,
        (SELECT COUNT(*) FROM doctors) AS total_doctors,
        (SELECT COUNT(*) FROM appointments) AS total_appointments,
        (SELECT NVL(SUM(total_amount), 0) FROM billing) AS total_revenue
      FROM DUAL
    `;

    // 2. LATEST PATIENTS (Using Advanced Window Functions / Inline Views)
    const latestPatientsQuery = `
      SELECT patient_id, name, phone FROM (
        SELECT patient_id, name, phone, ROW_NUMBER() OVER (ORDER BY patient_id DESC) as rn
        FROM patients
      ) WHERE rn <= 5
    `;

    // 3. LATEST DOCTORS (Using Advanced Window Functions / Inline Views)
    const latestDoctorsQuery = `
      SELECT doctor_id, name, specialization FROM (
        SELECT doctor_id, name, specialization, ROW_NUMBER() OVER (ORDER BY doctor_id DESC) as rn
        FROM doctors
      ) WHERE rn <= 5
    `;

    // 4. MONTHLY TREND (Using CTE / "WITH" Clause as an Inline View)
    // Cleaner grouping logic using TRUNC to ensure accurate chronological sorting
    const monthlyTrendQuery = `
      WITH AppointmentMonths AS (
        SELECT 
          TO_CHAR(appointment_date, 'MON') AS month_name, 
          TRUNC(appointment_date, 'MM') AS sort_date
        FROM appointments 
        WHERE appointment_date IS NOT NULL
      )
      SELECT month_name AS MONTH, COUNT(*) AS METRIC_COUNT
      FROM AppointmentMonths
      GROUP BY month_name, sort_date
      ORDER BY sort_date ASC
    `;

    // 5. DOCTOR WORKLOAD (Using CTE / Subquery Factoring)
    // Aggregating appointments BEFORE joining is vastly more performant on large datasets
    const doctorWorkloadQuery = `
      WITH WorkloadSummary AS (
        SELECT doctor_id, COUNT(appointment_id) AS appt_count
        FROM appointments
        GROUP BY doctor_id
      )
      SELECT d.name AS DOCTOR, NVL(w.appt_count, 0) AS APPOINTMENTS
      FROM doctors d
      LEFT JOIN WorkloadSummary w ON d.doctor_id = w.doctor_id
      ORDER BY APPOINTMENTS DESC
      FETCH FIRST 5 ROWS ONLY
    `;

    // 6. INVENTORY CATEGORIZATION (Using CTE for the CASE logic)
    const stockDistributionQuery = `
      WITH InventoryStatus AS (
        SELECT CASE WHEN quantity < 20 THEN 'LOW STOCK' ELSE 'AVAILABLE' END AS CATEGORY
        FROM inventory
      )
      SELECT CATEGORY, COUNT(*) AS ITEM_COUNT
      FROM InventoryStatus
      GROUP BY CATEGORY
    `;

    // 7. REVENUE BREAKDOWN
    const revenueBreakdownQuery = `
      SELECT status AS STATUS_KEY, SUM(total_amount) AS SUM_AMOUNT
      FROM billing
      GROUP BY status
    `;

    // ==========================================
    // PARALLEL EXECUTION (Performance Boost)
    // ==========================================
    const [
      summaryData,
      latestPatients,
      latestDoctors,
      monthlyTrend,
      doctorWorkload,
      stockDistribution,
      revenueBreakdown
    ] = await Promise.all([
      executeQuery(summaryQuery),
      executeQuery(latestPatientsQuery),
      executeQuery(latestDoctorsQuery),
      executeQuery(monthlyTrendQuery),
      executeQuery(doctorWorkloadQuery),
      executeQuery(stockDistributionQuery),
      executeQuery(revenueBreakdownQuery)
    ]);

    // Extract scalar values from the combined summary query result
    // Note: Oracle returns column names in uppercase by default
    const totals = summaryData[0] || {};

    return NextResponse.json({
      totalPatients: totals.TOTAL_PATIENTS || 0,
      totalDoctors: totals.TOTAL_DOCTORS || 0,
      totalAppointments: totals.TOTAL_APPOINTMENTS || 0,
      totalRevenue: Number(totals.TOTAL_REVENUE || 0),
      
      latestPatients,
      latestDoctors,
      
      monthlyPatients: monthlyTrend.map((item: any) => ({
        month: item.MONTH || item.month,
        patients: Number(item.METRIC_COUNT || item.metric_count), 
      })),
      
      doctorWorkload: doctorWorkload.map((w: any) => ({
        doctor: w.DOCTOR || w.doctor,
        appointments: Number(w.APPOINTMENTS || w.appointments)
      })),
      
      stockData: stockDistribution.map((s: any) => ({
        name: s.CATEGORY || s.category,
        value: Number(s.ITEM_COUNT || s.item_count)
      })),
      
      revenueStatus: revenueBreakdown.map((r: any) => ({
        status: r.STATUS_KEY || r.status_key,
        amount: Number(r.SUM_AMOUNT || r.sum_amount)
      }))
    });

  } catch (error: any) {
    console.error("Dashboard Backend Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}