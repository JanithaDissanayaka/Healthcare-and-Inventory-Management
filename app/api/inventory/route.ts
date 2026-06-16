import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// GET INVENTORY
// ======================================
export async function GET() {
  try {
    // Dynamic status evaluations are calculated at runtime based on threshold parameters
    const inventory = await executeQuery(`
      SELECT
        item_id,
        item_name,
        quantity,
        unit_price,
        CASE 
          WHEN quantity < 20 THEN 'LOW STOCK' 
          ELSE 'AVAILABLE' 
        END AS STATUS
      FROM inventory
      ORDER BY item_id DESC
    `);
    return NextResponse.json(inventory);
  } catch (error: any) {
    console.error("GET Inventory Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// ======================================
// ADD INVENTORY ITEM
// ======================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await executeQuery(`
      INSERT INTO inventory (item_name, quantity, unit_price)
      VALUES (:itemName, :quantity, :unitPrice)
    `, [
      body.itemName,
      Number(body.quantity),
      Number(body.unitPrice)
    ]);

    return NextResponse.json({ message: "Inventory item added successfully" });
  } catch (error: any) {
    console.error("POST Inventory Error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}