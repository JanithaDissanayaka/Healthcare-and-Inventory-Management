import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// UPDATE APPOINTMENT STATUS
// ======================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    await executeQuery(`
      UPDATE appointments
      SET status = :status
      WHERE appointment_id = :id
    `, [body.status, Number(id)]);

    return NextResponse.json({ message: "Appointment status updated" });
  } catch (error) {
    console.error("UPDATE Appointment Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ======================================
// DELETE APPOINTMENT
// ======================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await executeQuery(`
      DELETE FROM appointments
      WHERE appointment_id = :id
    `, [Number(id)]);

    return NextResponse.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("DELETE Appointment Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}