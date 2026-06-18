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

    // 4. NEW: Appointments grouped by status (for Donut chart)
    const statusBreakdown = await executeQuery(`
      SELECT
        a.STATUS AS STATUS_KEY,
        COUNT(*) AS TOTAL
      FROM appointments a
      GROUP BY a.STATUS
      ORDER BY a.STATUS
    `);

    // 5. NEW: Raw appointment counts per calendar day, last 14 days
    // (the continuous 14-day calendar, including zero-count days, is
    // built in JS below for portability across Oracle editions)
    const dailyRaw = await executeQuery(`
      SELECT
        TO_CHAR(TRUNC(a.appointment_date), 'YYYY-MM-DD') AS DAY_KEY,
        COUNT(*) AS TOTAL
      FROM appointments a
      WHERE a.appointment_date >= TRUNC(SYSDATE) - 13
        AND a.appointment_date < TRUNC(SYSDATE) + 1
      GROUP BY TRUNC(a.appointment_date)
      ORDER BY TRUNC(a.appointment_date) ASC
    `);

    // Build a continuous 14-day calendar (today and the 13 days before it)
    // so days with zero appointments still show up as 0 on the chart
    // instead of being silently skipped.
    const countsByDay = new Map<string, number>(
      dailyRaw.map((row: { DAY_KEY: string; TOTAL: number }) => [row.DAY_KEY, Number(row.TOTAL)])
    );
    const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dailyTrend = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (13 - i));
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dayKey = `${yyyy}-${mm}-${dd}`;
      return {
        DAY_KEY: dayKey,
        DAY_LABEL: `${MONTH_LABELS[d.getMonth()]} ${dd}`,
        TOTAL: countsByDay.get(dayKey) || 0,
      };
    });

    return NextResponse.json({
      appointments,
      analytics,
      busyDoctors,
      statusBreakdown,
      dailyTrend,
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