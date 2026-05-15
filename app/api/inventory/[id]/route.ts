import { NextResponse } from "next/server";
import oracledb from "oracledb";

import { getConnection }
from "@/lib/db";



// UPDATE INVENTORY
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params:
      Promise<{ id: string }>
  }
) {

  let connection;

  try {

    const body =
      await req.json();

    const { id } =
      await params;

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
      UPDATE INVENTORY
      SET
        QUANTITY = :quantity,
        UNIT_PRICE = :unitPrice,
        STATUS = :status
      WHERE ITEM_ID = :id
      `,
      {
        quantity:
          body.quantity,

        unitPrice:
          body.unitPrice,

        status,

        id,
      },
      {
        autoCommit: true,
      }
    );



    return NextResponse.json({
      message:
        "Inventory updated",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Update failed",
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



// DELETE INVENTORY
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params:
      Promise<{ id: string }>
  }
) {

  let connection;

  try {

    const { id } =
      await params;

    connection =
      await getConnection();

    await connection.execute(
      `
      DELETE FROM INVENTORY
      WHERE ITEM_ID = :id
      `,
      {
        id,
      },
      {
        autoCommit: true,
      }
    );



    return NextResponse.json({
      message:
        "Inventory deleted",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Delete failed",
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