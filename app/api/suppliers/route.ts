import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET ALL SUPPLIERS & METRICS
// ======================================
export async function GET() {
  try {
    // We use TO_CHAR(notes) to flatten the complex stream object into a plain string!
    const suppliers = await executeQuery(`
      SELECT 
        supplier_id AS ID,
        supplier_name AS NAME,
        email AS EMAIL,
        category AS CATEGORY,
        contact AS CONTACT,
        address AS ADDRESS,
        TO_CHAR(notes) AS NOTES,
        status AS STATUS
      FROM suppliers
      ORDER BY supplier_id DESC
    `);

    // Fetch analytical counts
    const activeSummary = await executeQuery(`
      SELECT 
        COUNT(*) AS TOTAL,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS ACTIVE_COUNT,
        SUM(CASE WHEN status = 'Review' THEN 1 ELSE 0 END) AS REVIEW_COUNT
      FROM suppliers
    `);

    return NextResponse.json({
      suppliers: suppliers || [],
      total: activeSummary[0]?.TOTAL || 0,
      active: activeSummary[0]?.ACTIVE_COUNT || 0,
      review: activeSummary[0]?.REVIEW_COUNT || 0,
    });

  } catch (error: any) {
    console.error("GET Suppliers Error:", error);
    return NextResponse.json({ error: "Failed to read suppliers ledger" }, { status: 500 });
  }
}

// ======================================
// REGISTER NEW VENDOR / SUPPLIER
// ======================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await executeQuery(`
      INSERT INTO suppliers (supplier_name, email, contact, category, address, notes, status)
      VALUES (:supplierName, :email, :contact, :category, :address, :notes, :status)
    `, [
      body.supplierName,
      body.email,
      body.contact,
      body.category,
      body.address,
      body.notes || null,
      body.status || 'Active'
    ]);

    return NextResponse.json({ message: "Dental Supplier registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST Supplier Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}