import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    const appointmentAlerts = await executeQuery(`
      SELECT COUNT(*) AS TOTAL FROM appointments WHERE status = 'PENDING'
    `);

    const criticalStockAlerts = await executeQuery(`
      SELECT COUNT(*) AS TOTAL FROM inventory WHERE quantity < 20
    `);

    // Dynamic Server performance evaluation loop (Checks if Oracle is responding quickly)
    const startTime = Date.now();
    await executeQuery("SELECT 1 FROM DUAL");
    const responseTime = Date.now() - startTime;
    
    // Performance calculation drops slightly if response intervals delay
    const performanceFactor = Math.max(70, Math.min(100, 100 - (responseTime / 10)));

    return NextResponse.json({
      appointmentsCount: appointmentAlerts[0]?.TOTAL || 0,
      lowStockCount: criticalStockAlerts[0]?.TOTAL || 0,
      systemHealth: "All services operational",
      performance: Math.round(performanceFactor)
    });

  } catch (error: any) {
    console.error("GET Sidebar Metrics Error:", error);
    return NextResponse.json({ 
      appointmentsCount: 0, 
      lowStockCount: 0,
      systemHealth: "Database Unreachable",
      performance: 0
    });
  }
}