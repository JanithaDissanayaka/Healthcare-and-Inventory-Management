import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// ======================================
// UPDATE SUPPLIER STATUS OR PROFILE DETAILS
// ======================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Check if it's a quick status update or a full profile edit save
    if (body.action === 'UPDATE_STATUS') {
      await executeQuery(`
        UPDATE suppliers 
        SET status = :status 
        WHERE supplier_id = :id
      `, [body.status, Number(id)]);
      
      return NextResponse.json({ message: "Supplier status changed successfully" });
    }

    // Full profile edit update
    await executeQuery(`
      UPDATE suppliers 
      SET 
        supplier_name = :name,
        email = :email,
        contact = :contact,
        category = :category,
        address = :address,
        notes = :notes
      WHERE supplier_id = :id
    `, [
      body.supplierName,
      body.email,
      body.contact,
      body.category,
      body.address,
      body.notes || null,
      Number(id)
    ]);

    return NextResponse.json({ message: "Supplier profile updated successfully" });

  } catch (error: any) {
    console.error("PUT Supplier Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}