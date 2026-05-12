import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";


// GET PRESCRIPTIONS
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        p.PRESCRIPTION_ID,
        p.TREATMENT_ID,
        p.MEDICINE_NAME,
        p.DOSAGE,
        p.DURATION,
        t.TREATMENT_TYPE
      FROM PRESCRIPTION p
      JOIN TREATMENT t
        ON p.TREATMENT_ID = t.TREATMENT_ID
      ORDER BY p.PRESCRIPTION_ID DESC
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



// ADD PRESCRIPTION
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO PRESCRIPTION
      (
        TREATMENT_ID,
        MEDICINE_NAME,
        DOSAGE,
        DURATION
      )
      VALUES
      (
        :treatmentId,
        :medicineName,
        :dosage,
        :duration
      )
      `,
      {
        treatmentId: body.treatmentId,
        medicineName: body.medicineName,
        dosage: body.dosage,
        duration: body.duration,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Prescription added successfully",
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