import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";



// ===============================
// GET SINGLE DOCTOR
// ===============================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  let connection;

  try {

    const { id } = await params;

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        DOCTOR_ID,
        DOCTOR_NAME AS NAME,
        SPECIALIZATION,
        PHONE,
        EMAIL,
        SALARY
      FROM DOCTOR
      WHERE DOCTOR_ID = :id
      `,
      {
        id,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json(
      result.rows?.[0]
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed",
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



// ===============================
// UPDATE DOCTOR
// ===============================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  let connection;

  try {

    const body = await req.json();

    const { id } = await params;

    connection = await getConnection();

    await connection.execute(
      `
      UPDATE DOCTOR
      SET
        PHONE = :phone,
        EMAIL = :email,
        SALARY = :salary
      WHERE DOCTOR_ID = :id
      `,
      {
        phone: body.phone,
        email: body.email,
        salary: body.salary,
        id,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Doctor updated successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Update failed",
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



// ===============================
// DELETE DOCTOR
// ===============================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  let connection;

  try {

    const { id } = await params;

    connection = await getConnection();

    await connection.execute(
      `
      DELETE FROM DOCTOR
      WHERE DOCTOR_ID = :id
      `,
      {
        id,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Doctor deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Delete failed",
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