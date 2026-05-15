import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";



// ======================================
// UPDATE APPOINTMENT STATUS
// ======================================
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>
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

    await connection.execute(
      `
      UPDATE APPOINTMENT
      SET STATUS = :status
      WHERE APPOINTMENT_ID = :id
      `,
      {
        status:
          body.status,

        id,
      },
      {
        autoCommit: true,
      }
    );



    return NextResponse.json({
      message:
        "Appointment status updated",
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



// ======================================
// DELETE APPOINTMENT
// ======================================
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>
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
      DELETE FROM APPOINTMENT
      WHERE APPOINTMENT_ID = :id
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
        "Appointment deleted",
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