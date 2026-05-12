import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";


// GET INVENTORY
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT *
      FROM INVENTORY
      ORDER BY ITEM_ID DESC
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json(
      result.rows || []
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Database error",
      },
      {
        status: 500,
      }
    );

  } finally {

    if (connection) {
      await connection.close();
    }
  }
}



// ADD INVENTORY ITEM
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();

    let status = "Good";

    if (body.quantity <= 10) {
      status = "Critical";
    } else if (body.quantity <= 50) {
      status = "Low";
    }

    await connection.execute(
      `
      INSERT INTO INVENTORY
      (
        ITEM_NAME,
        CATEGORY,
        QUANTITY,
        UNIT,
        EXPIRY_DATE,
        SUPPLIER_NAME,
        NOTES,
        STATUS
      )
      VALUES
      (
        :itemName,
        :category,
        :quantity,
        :unit,
        TO_DATE(:expiryDate, 'YYYY-MM-DD'),
        :supplierName,
        :notes,
        :status
      )
      `,
      {
        itemName: body.itemName,
        category: body.category,
        quantity: body.quantity,
        unit: body.unit,
        expiryDate: body.expiryDate,
        supplierName: body.supplierName,
        notes: body.notes,
        status: status,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Inventory item added successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Insert failed",
      },
      {
        status: 500,
      }
    );

  } finally {

    if (connection) {
      await connection.close();
    }
  }
}