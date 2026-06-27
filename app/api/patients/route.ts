import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET ALL PATIENTS (For selection dropdown lists and Patients Page)
// ======================================
export async function GET() {
  try {
    // Added DOB, GENDER, and ADDRESS and aliased them to uppercase 
    // so they perfectly match what your PatientsPage component expects.
    const patients = await executeQuery(`
      SELECT 
        patient_id AS PATIENT_ID, 
        name AS NAME, 
        dob AS DOB, 
        gender AS GENDER, 
        phone AS PHONE, 
        address AS ADDRESS,
        blood_group AS BLOOD_GROUP
      FROM patients
      ORDER BY name ASC
    `);

    // Returning empty arrays for genderStats and activePatients so your 
    // frontend doesn't crash while trying to map over them.
    return NextResponse.json({ 
      patients: patients || [],
      genderStats: [], 
      activePatients: []
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

    // 1. Combine firstName and lastName into a single string for the database
    const fullName = `${body.firstName} ${body.lastName}`.trim();

    // 2. Use the exact columns from your table creation query
    // Notice we pass an object {} instead of an array [] for the bind variables. 
    // This is the standard way to map named variables (like :name) in Oracle.
    await executeQuery(`
      INSERT INTO patients (name, dob, gender, phone, blood_group, address)
      VALUES (:name, TO_DATE(:dob, 'YYYY-MM-DD'), :gender, :phone, :bloodGroup, :address)
    `, {
      name: fullName,
      dob: body.dob,
      gender: body.gender,
      phone: body.phone,
      bloodGroup: body.bloodGroup,
      address: body.address
    });

    return NextResponse.json({ message: "Patient registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST Patient Registration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}