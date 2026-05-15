import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";



// ===============================
// GET ALL DOCTORS
// ===============================
export async function GET() {

  let connection;

  try {

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
      ORDER BY DOCTOR_ID DESC
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



// ===============================
// ADD DOCTOR
// ===============================
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO DOCTOR
      (
        DOCTOR_ID,
        DOCTOR_NAME,
        SPECIALIZATION,
        PHONE,
        EMAIL,
        SALARY
      )
      VALUES
      (
        DOCTOR_SEQ.NEXTVAL,
        :name,
        :specialization,
        :phone,
        :email,
        :salary
      )
      `,
      {
        name: body.name,
        specialization: body.specialization,
        phone: body.phone,
        email: body.email,
        salary: body.salary,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Doctor added successfully",
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