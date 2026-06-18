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

    // 3. NEW: Invoice status breakdown for the Paid / Pending / Overdue donut.
    // The schema only ever stores 'Paid' or 'Pending' — there is no distinct
    // 'Overdue' status column. We derive Overdue here as a business rule:
    // any Pending invoice whose billing_date is more than 30 days old.
    // Pending invoices within that 30-day window stay counted as Pending.
    const statusBreakdown = await executeQuery(`
      SELECT
        CASE
          WHEN status = 'Pending' AND TRUNC(billing_date) < TRUNC(SYSDATE) - 30 THEN 'Overdue'
          ELSE status
        END AS STATUS_KEY,
        COUNT(*) AS TOTAL
      FROM billing
      GROUP BY
        CASE
          WHEN status = 'Pending' AND TRUNC(billing_date) < TRUNC(SYSDATE) - 30 THEN 'Overdue'
          ELSE status
        END
    `);

    // 4. NEW: Revenue collected per calendar day, last 14 days (raw rows;
    // the continuous zero-filled calendar is built in JS below, same
    // approach used for the appointments daily trend chart).
    const revenueRaw = await executeQuery(`
      SELECT
        TO_CHAR(TRUNC(b.billing_date), 'YYYY-MM-DD') AS DAY_KEY,
        SUM(b.total_amount) AS TOTAL
      FROM billing b
      WHERE b.billing_date >= TRUNC(SYSDATE) - 13
        AND b.billing_date < TRUNC(SYSDATE) + 1
      GROUP BY TRUNC(b.billing_date)
      ORDER BY TRUNC(b.billing_date) ASC
    `);

    const revenueByDay = new Map<string, number>(
      revenueRaw.map((row: { DAY_KEY: string; TOTAL: number }) => [row.DAY_KEY, Number(row.TOTAL)])
    );
    const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrend = Array.from({ length: 14 }, (_, i) => {
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
        TOTAL: revenueByDay.get(dayKey) || 0,
      };
    });

    // 5. NEW: Top billed patients by total invoiced amount (for the
    // horizontal bar chart). Uses SUM rather than COUNT since "top billed"
    // means highest revenue, not highest invoice volume.
    const topPatients = await executeQuery(`
      SELECT
        p.name AS PATIENT_NAME,
        SUM(b.total_amount) AS TOTAL_BILLED
      FROM billing b
      LEFT JOIN patients p ON b.patient_id = p.patient_id
      GROUP BY p.name
      ORDER BY TOTAL_BILLED DESC
      FETCH FIRST 8 ROWS ONLY
    `);

    return NextResponse.json({
      totalInvoices: summary[0]?.TOTAL_INVOICES || 0,
      paidInvoices: summary[0]?.PAID_INVOICES || 0,
      overdueInvoices: summary[0]?.PENDING_INVOICES || 0, // Using Pending as an unhandled proxy flag
      invoices,
      statusBreakdown,
      revenueTrend,
      topPatients,
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