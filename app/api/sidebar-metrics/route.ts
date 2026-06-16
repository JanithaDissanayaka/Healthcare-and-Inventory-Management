import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // 1. Calculate active unhandled patient appointment slots
    const appointmentAlerts = await executeQuery(`
      SELECT COUNT(*) AS TOTAL 
      FROM appointments 
      WHERE status = 'PENDING'
    `);

    // 2. Count distinct items that are low in stock (quantity < 20)
    const criticalStockAlerts = await executeQuery(`
      SELECT COUNT(*) AS TOTAL 
      FROM inventory 
      WHERE quantity < 20
    `);

    return NextResponse.json({
      appointmentsCount: appointmentAlerts[0]?.TOTAL || 0,
      lowStockCount: criticalStockAlerts[0]?.TOTAL || 0,
    });

  } catch (error: any) {
    console.error("GET Sidebar Metrics Error:", error);
    return NextResponse.json({ appointmentsCount: 0, lowStockCount: 0 });
  }
}