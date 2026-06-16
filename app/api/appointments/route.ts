import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET ALL APPOINTMENTS & ANALYTICS
// ======================================
export async function GET() {
  try {
    // 1. Fetch appointments with joined virtual name fields
    const appointments = await executeQuery(`
      SELECT
        a.APPOINTMENT_ID,
        p.NAME AS PATIENT_NAME,
        d.NAME AS DOCTOR_NAME,
        TO_CHAR(a.APPOINTMENT_DATE, 'YYYY-MM-DD') AS APPOINTMENT_DATE,
        a.STATUS
      FROM appointments a
      INNER JOIN patients p ON a.patient_id = p.patient_id
      INNER JOIN doctors d ON a.doctor_id = d.doctor_id
      ORDER BY a.appointment_id DESC
    `);

    // 2. Fetch total appointments count grouped by doctor name
    const analytics = await executeQuery(`
      SELECT
        d.NAME AS DOCTOR_NAME,
        COUNT(a.appointment_id) AS TOTAL_APPOINTMENTS
      FROM doctors d
      LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
      GROUP BY d.NAME
      ORDER BY TOTAL_APPOINTMENTS DESC
    `);

    // 3. Busy Doctors query (Doctors with more than 5 appointments)
    const busyDoctors = await executeQuery(`
      SELECT NAME FROM doctors
      WHERE doctor_id IN (
        SELECT doctor_id
        FROM appointments
        GROUP BY doctor_id
        HAVING COUNT(*) > 5
      )
    `);

    return NextResponse.json({
      appointments,
      analytics,
      busyDoctors,
    });

  } catch (error: any) {
    console.error("GET Appointments Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// ======================================
// ADD APPOINTMENT
// ======================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Use standard implicit identity column insertion without sequences
    await executeQuery(`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, status)
      VALUES (:patientId, :doctorId, TO_DATE(:dateValue, 'YYYY-MM-DD'), :status)
    `, [
      Number(body.patientId),
      Number(body.doctorId),
      body.date,
      body.status || 'PENDING'
    ]);

    return NextResponse.json({ message: "Appointment added successfully" });
  } catch (error: any) {
    console.error("POST Appointment Error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}