import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET ALL PATIENTS (For selection dropdown lists)
// ======================================
export async function GET() {
  try {
    // Removed 'email' to match your actual database schema
    const patients = await executeQuery(`
      SELECT patient_id AS PATIENT_ID, name, phone, blood_group
      FROM patients
      ORDER BY name ASC
    `);
    return NextResponse.json({ patients });
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