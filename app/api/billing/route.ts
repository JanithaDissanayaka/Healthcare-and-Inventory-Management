import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET BILLING SUMMARY METRICS & INVOICES
// ======================================
export async function GET() {
  try {
    // 1. Fetch Summary Counters
    const summary = await executeQuery(`
      SELECT 
        COUNT(*) AS TOTAL_INVOICES,
        SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) AS PAID_INVOICES,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS PENDING_INVOICES
      FROM billing
    `);

    // 2. Fetch Detailed Recent Invoices List
    const invoices = await executeQuery(`
      SELECT 
        b.bill_id AS ID,
        p.name AS PATIENT_NAME,
        b.total_amount AS AMOUNT,
        b.status AS STATUS,
        TO_CHAR(b.billing_date, 'YYYY-MM-DD') AS BILLING_DATE
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.patient_id
      ORDER BY b.bill_id DESC
      FETCH FIRST 10 ROWS ONLY
    `);

    return NextResponse.json({
      totalInvoices: summary[0]?.TOTAL_INVOICES || 0,
      paidInvoices: summary[0]?.PAID_INVOICES || 0,
      overdueInvoices: summary[0]?.PENDING_INVOICES || 0, // Using Pending as an unhandled proxy flag
      invoices
    });

  } catch (error: any) {
    console.error("GET Billing Summary Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ======================================
// CREATE NEW INVOICE WITH LINE ITEMS
// ======================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Insert Core Parent Billing Row (Using Oracle Returning Clause or explicit lookups)
    // For implicit identity keys, we insert and query max or extract ID contextually
    await executeQuery(`
      INSERT INTO billing (patient_id, billing_date, total_amount, status)
      VALUES (:patientId, TO_DATE(:billingDate, 'YYYY-MM-DD'), :total, :status)
    `, [
      Number(body.patient), // Expecting Patient ID string
      body.billingDate,
      Number(body.total),
      body.status || 'Pending'
    ]);

    // Get the generated primary key to match children constraints
    const latestBill = await executeQuery("SELECT MAX(bill_id) AS MAX_ID FROM billing");
    const parentId = latestBill[0]?.MAX_ID;

    // 2. Batch write children nested transaction subitems
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await executeQuery(`
          INSERT INTO billing_items (bill_id, description, amount)
          VALUES (:billId, :description, :amount)
        `, [parentId, item.description, Number(item.amount)]);
      }
    }

    return NextResponse.json({ message: "Invoice created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("POST Invoice Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}