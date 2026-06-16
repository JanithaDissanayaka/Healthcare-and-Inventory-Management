import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// UPDATE INVENTORY ITEM
// ======================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;

    // Optional business logic checking can remain in application code or be handled by SQL views
    const quantity = Number(body.quantity);

    await executeQuery(`
      UPDATE inventory
      SET quantity = :quantity,
          unit_price = :unitPrice
      WHERE item_id = :id
    `, [quantity, Number(body.unitPrice), Number(id)]);

    return NextResponse.json({ message: "Inventory updated" });
  } catch (error) {
    console.error("UPDATE Inventory Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ======================================
// DELETE INVENTORY ITEM
// ======================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await executeQuery(`
      DELETE FROM inventory
      WHERE item_id = :id
    `, [Number(id)]);

    return NextResponse.json({ message: "Inventory deleted" });
  } catch (error) {
    console.error("DELETE Inventory Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}