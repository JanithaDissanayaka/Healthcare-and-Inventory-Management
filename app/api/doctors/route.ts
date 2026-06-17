import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ====================================
// GET ALL DOCTORS & ACTIVE DUTY METRICS
// ====================================
export async function GET() {
  try {
    // We use explicit UPPERCASE aliases here so the object returned 
    // to Next.js matches your frontend type exactly (e.g., doc.NAME, doc.SPECIALIZATION)
    const doctors = await executeQuery(`
      SELECT 
        doctor_id AS ID, 
        name AS NAME, 
        specialization AS SPECIALIZATION, 
        phone AS PHONE, 
        email AS EMAIL, 
        salary AS SALARY, 
        created_at AS CREATED_AT
      FROM doctors
      ORDER BY doctor_id DESC
    `);

    // Fetch unique count of doctors currently tied to active schedules
    const activeDutySummary = await executeQuery(`
      SELECT COUNT(DISTINCT doctor_id) AS ACTIVE_COUNT 
      FROM appointments 
      WHERE status IN ('PENDING', 'COMPLETED')
    `);

    return NextResponse.json({
      doctorsList: doctors || [],
      activeOnDuty: activeDutySummary[0]?.ACTIVE_COUNT || 0
    });

  } catch (error: any) {
    console.error("❌ GET Doctors API Error:", error);
    return NextResponse.json({ error: "Database error reading records" }, { status: 500 });
  }
}

// ====================================
// ADD DOCTOR / PRACTITIONER
// ====================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await executeQuery(`
      INSERT INTO doctors (name, specialization, phone, email, salary)
      VALUES (:name, :specialization, :phone, :email, :salary)
    `, [
      body.name,
      body.specialization,
      body.phone,
      body.email,
      body.salary ? Number(body.salary) : null
    ]);

    return NextResponse.json({ message: "Practitioner registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST Doctor Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}