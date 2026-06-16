import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ===============================
// GET SINGLE PATIENT
// ===============================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await executeQuery(`
      SELECT 
        patient_id AS PATIENT_ID, 
        name AS NAME, 
        TO_CHAR(dob, 'YYYY-MM-DD') AS DOB, 
        gender AS GENDER, 
        phone AS PHONE, 
        address AS ADDRESS
      FROM patients
      WHERE patient_id = :id
    `, [Number(id)]);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET Patient Error:", error);
    return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
  }
}

// ===============================
// UPDATE PATIENT
// ===============================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    await executeQuery(`
      UPDATE patients
      SET phone = :phone,
          address = :address
      WHERE patient_id = :id
    `, [body.phone, body.address, Number(id)]);

    return NextResponse.json({ message: "Patient updated successfully" });
  } catch (error) {
    console.error("UPDATE Patient Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ===============================
// DELETE PATIENT
// ===============================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await executeQuery(`
      DELETE FROM patients
      WHERE patient_id = :id
    `, [Number(id)]);

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("DELETE Patient Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}