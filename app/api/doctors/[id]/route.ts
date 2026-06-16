import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ===============================
// GET SINGLE DOCTOR
// ===============================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await executeQuery(`
      SELECT doctor_id AS ID, name, specialization, phone, email, salary
      FROM doctors
      WHERE doctor_id = :id
    `, [Number(id)]);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET Doctor Error:", error);
    return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
  }
}

// ===============================
// UPDATE DOCTOR
// ===============================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    await executeQuery(`
      UPDATE doctors
      SET phone = :phone,
          email = :email,
          salary = :salary
      WHERE doctor_id = :id
    `, [body.phone, body.email, body.salary ? Number(body.salary) : null, Number(id)]);

    return NextResponse.json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error("UPDATE Doctor Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ===============================
// DELETE DOCTOR
// ===============================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await executeQuery(`
      DELETE FROM doctors
      WHERE doctor_id = :id
    `, [Number(id)]);

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("DELETE Doctor Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}