import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET INDIVIDUAL INVOICE SERVICE ITEMS
// ======================================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const items = await executeQuery(`
      SELECT item_id, description, amount 
      FROM billing_items 
      WHERE bill_id = :id
      ORDER BY item_id ASC
    `, [Number(id)]);

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("GET Invoice Items Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ======================================
// UPDATE INVOICE PAYMENT STATUS TO PAID
// ======================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await executeQuery(`
      UPDATE billing 
      SET status = 'Paid' 
      WHERE bill_id = :id
    `, [Number(id)]);

    return NextResponse.json({ message: "Invoice updated to PAID status successfully" });
  } catch (error: any) {
    console.error("PUT Billing Pay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}