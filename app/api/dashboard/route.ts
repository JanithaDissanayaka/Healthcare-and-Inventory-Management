import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // Collect primary summary counters
    const pCount = await executeQuery("SELECT COUNT(*) AS TOTAL FROM patients");
    const dCount = await executeQuery("SELECT COUNT(*) AS TOTAL FROM doctors");
    const aCount = await executeQuery("SELECT COUNT(*) AS TOTAL FROM appointments");
    
    // Revenue is calculated from your valid billing table schema
    const rCount = await executeQuery("SELECT NVL(SUM(total_amount), 0) AS TOTAL FROM billing");

    // Fetch up to 5 latest patient admissions
    const latestPatients = await executeQuery(`
      SELECT patient_id, name, phone FROM patients
      ORDER BY patient_id DESC
      FETCH FIRST 5 ROWS ONLY
    `);

    // Fetch up to 5 latest doctor recruits
    const latestDoctors = await executeQuery(`
      SELECT doctor_id, name, specialization, phone, email, salary FROM doctors
      ORDER BY doctor_id DESC
      FETCH FIRST 5 ROWS ONLY
    `);

    // Track monthly data points using the patient creation column
    const monthlyPatientsData = await executeQuery(`
      SELECT
        TO_CHAR(created_at, 'MON') AS MONTH,
        COUNT(*) AS PATIENTS,
        MIN(created_at) AS sort_key
      FROM patients
      GROUP BY TO_CHAR(created_at, 'MON')
      ORDER BY sort_key ASC
    `);

    return NextResponse.json({
      totalPatients: pCount[0]?.TOTAL || 0,
      totalDoctors: dCount[0]?.TOTAL || 0,
      totalAppointments: aCount[0]?.TOTAL || 0,
      totalRevenue: Number(rCount[0]?.TOTAL || 0),
      latestPatients,
      latestDoctors,
      monthlyPatients: monthlyPatientsData.map((item: any) => ({
        month: item.MONTH,
        patients: Number(item.PATIENTS),
      })),
    });

  } catch (error: any) {
    console.error("Dashboard Endpoint Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}