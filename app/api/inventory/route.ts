import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";



// ======================================
// GET INVENTORY
// ======================================
export async function GET() {

  let connection;

  try {

    connection =
      await getConnection();

    const result =
      await connection.execute(
        `
        SELECT
          ITEM_ID,
          ITEM_NAME,
          QUANTITY,
          UNIT_PRICE,
          STATUS
        FROM INVENTORY
        ORDER BY ITEM_ID DESC
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    return NextResponse.json(
      result.rows || []
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Database error",
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



// ======================================
// ADD INVENTORY ITEM
// ======================================
export async function POST(
  req: Request
) {

  let connection;

  try {

    const body =
      await req.json();

    connection =
      await getConnection();

    let status =
      "AVAILABLE";



    if (
      Number(body.quantity) < 20
    ) {

      status = "LOW STOCK";

    }



    await connection.execute(
      `
      INSERT INTO INVENTORY
      (
        ITEM_ID,
        ITEM_NAME,
        QUANTITY,
        UNIT_PRICE,
        STATUS
      )
      VALUES
      (
        INVENTORY_SEQ.NEXTVAL,
        :itemName,
        :quantity,
        :unitPrice,
        :status
      )
      `,
      {
        itemName:
          body.itemName,

        quantity:
          body.quantity,

        unitPrice:
          body.unitPrice,

        status,
      },
      {
        autoCommit: true,
      }
    );



    return NextResponse.json({
      message:
        "Inventory item added successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Insert failed",
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