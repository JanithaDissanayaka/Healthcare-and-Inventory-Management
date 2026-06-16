import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // Fetch pending appointments as live notification alerts
    const alerts = await executeQuery(`
      SELECT 
        a.appointment_id AS ID,
        'New Appointment Request' AS TITLE,
        p.name || ' has requested an appointment.' AS MESSAGE,
        'PENDING' AS STATUS
      FROM appointments a
      INNER JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.status = 'PENDING'
      ORDER BY a.appointment_id DESC
      FETCH FIRST 5 ROWS ONLY
    `);

    return NextResponse.json({
      unreadCount: alerts.length,
      notifications: alerts
    });

  } catch (error: any) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}