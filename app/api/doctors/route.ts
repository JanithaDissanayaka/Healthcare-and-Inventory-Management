import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ====================================
// GET ALL DOCTORS
// ====================================
export async function GET() {
  try {
    const doctors = await executeQuery(`
      SELECT doctor_id AS ID, name, specialization, phone, email, salary, created_at
      FROM doctors
      ORDER BY doctor_id DESC
    `);
    return NextResponse.json(doctors);
  } catch (error: any) {
    console.error("GET Doctors Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// ====================================
// ADD DOCTOR
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

    return NextResponse.json({ message: "Doctor added successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST Doctor Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}