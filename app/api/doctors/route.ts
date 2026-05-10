import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";


// GET ALL DOCTORS
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `SELECT * FROM DOCTOR`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json(result.rows || []);

  } catch (error) {

    console.error(error);

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



// ADD DOCTOR
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO DOCTOR
      (Name, Specialization, Phone, Experience_Years)
      VALUES
      (
        :name,
        :specialization,
        :phone,
        :experience
      )
      `,
      {
        name: body.name,
        specialization: body.specialization,
        phone: body.phone,
        experience: body.experience,
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
      { error: "Insert failed" },
      { status: 500 }
    );

  } finally {

    if (connection) {
      await connection.close();
    }
  }
}