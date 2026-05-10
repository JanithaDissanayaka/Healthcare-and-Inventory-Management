import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";


// GET PATIENTS
export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT * FROM PATIENT`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json(result.rows);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



// ADD PATIENT
export async function POST(req: Request) {
  let connection;

  try {
    const body = await req.json();

    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO PATIENT
      (Name, DOB, Gender, Phone, Address)
      VALUES
      (
        :name,
        TO_DATE(:dob, 'YYYY-MM-DD'),
        :gender,
        :phone,
        :address
      )
      `,
      {
        name: body.name,
        dob: body.dob,
        gender: body.gender,
        phone: body.phone,
        address: body.address,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Patient added successfully",
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Insert failed" },
      { status: 500 }
    );

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}