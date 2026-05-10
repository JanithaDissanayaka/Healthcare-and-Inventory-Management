import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT * FROM PATIENT
      WHERE PATIENT_ID = :id
      `,
      [id],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json(result.rows?.[0]);

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