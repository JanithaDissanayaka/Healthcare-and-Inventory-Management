import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET ALL PATIENTS + ANALYTICS
// ======================================
export async function GET() {
  try {
    // Full patient list
    const patients = await executeQuery(`
      SELECT
        patient_id AS PATIENT_ID,
        name,
        TO_CHAR(dob, 'YYYY-MM-DD') AS DOB,
        gender,
        phone,
        address
      FROM patients
      ORDER BY patient_id DESC
    `);

    // Patients who have at least one appointment (subquery)
    const activePatients = await executeQuery(`
      SELECT DISTINCT name
      FROM patients
      WHERE patient_id IN (
        SELECT DISTINCT patient_id FROM appointments
      )
      ORDER BY name ASC
    `);

    // Gender distribution
    const genderStats = await executeQuery(`
      SELECT gender AS GENDER, COUNT(*) AS TOTAL
      FROM patients
      GROUP BY gender
    `);

    // Monthly registrations trend
    const registrationTrend = await executeQuery(`
      SELECT
        TO_CHAR(created_at, 'MON YYYY') AS MONTH,
        COUNT(*) AS TOTAL,
        MIN(created_at) AS sort_key
      FROM patients
      GROUP BY TO_CHAR(created_at, 'MON YYYY')
      ORDER BY sort_key ASC
    `);

    // Age group breakdown (derived from DOB)
    const ageGroups = await executeQuery(`
      SELECT
        CASE
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 18  THEN 'Under 18'
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 30  THEN '18-29'
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 45  THEN '30-44'
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 60  THEN '45-59'
          ELSE '60+'
        END AS AGE_GROUP,
        COUNT(*) AS TOTAL
      FROM patients
      WHERE dob IS NOT NULL
      GROUP BY
        CASE
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 18  THEN 'Under 18'
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 30  THEN '18-29'
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 45  THEN '30-44'
          WHEN FLOOR(MONTHS_BETWEEN(SYSDATE, dob) / 12) < 60  THEN '45-59'
          ELSE '60+'
        END
      ORDER BY MIN(dob) ASC
    `);

    return NextResponse.json({
      patients,
      activePatients,
      genderStats,
      registrationTrend: registrationTrend.map((r: any) => ({
        month: r.MONTH,
        patients: Number(r.TOTAL),
      })),
      ageGroups: ageGroups.map((a: any) => ({
        group: a.AGE_GROUP,
        total: Number(a.TOTAL),
      })),
    });

  } catch (error: any) {
    console.error("GET Patients Routing Error:", error);
    return NextResponse.json({ error: "Database reading failed" }, { status: 500 });
  }
}

// ======================================
// REGISTER NEW PATIENT
// ======================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await executeQuery(`
      INSERT INTO patients (first_name, last_name, dob, gender, phone, blood_group, address)
      VALUES (:firstName, :lastName, TO_DATE(:dob, 'YYYY-MM-DD'), :gender, :phone, :bloodGroup, :address)
    `, [
      body.firstName,
      body.lastName,
      body.dob,
      body.gender,
      body.phone,
      body.bloodGroup,
      body.address
    ]);

    return NextResponse.json({ message: "Patient registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST Patient Registration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}