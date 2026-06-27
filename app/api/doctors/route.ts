import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// GET ALL DOCTORS
export async function GET() {
  try {
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

    const activeDutySummary = await executeQuery(`
      SELECT COUNT(DISTINCT doctor_id) AS ACTIVE_COUNT
      FROM appointments
      WHERE status IN ('PENDING', 'COMPLETED')
    `);

    return NextResponse.json({
      doctorsList: doctors || [],
      activeOnDuty: activeDutySummary?.[0]?.ACTIVE_COUNT || 0
    });

  } catch (error) {
    console.error("GET doctors error:", error);
    return NextResponse.json(
      { error: "Database error reading doctors" },
      { status: 500 }
    );
  }
}

// CREATE DOCTOR
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

    return NextResponse.json(
      { message: "Doctor added successfully" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("POST doctor error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}