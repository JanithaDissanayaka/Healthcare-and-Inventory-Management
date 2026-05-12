import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";


// GET TREATMENTS
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        t.TREATMENT_ID,
        t.APPOINTMENT_ID,
        t.TREATMENT_TYPE,
        t.DESCRIPTION,
        t.COST,
        p.NAME AS PATIENT_NAME
      FROM TREATMENT t
      JOIN APPOINTMENT a
        ON t.APPOINTMENT_ID = a.APPOINTMENT_ID
      JOIN PATIENT p
        ON a.PATIENT_ID = p.PATIENT_ID
      ORDER BY t.TREATMENT_ID DESC
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



// ADD TREATMENT
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO TREATMENT
      (
        Appointment_ID,
        Treatment_Type,
        Description,
        Cost
      )
      VALUES
      (
        :appointmentId,
        :treatmentType,
        :description,
        :cost
      )
      `,
      {
        appointmentId: body.appointmentId,
        treatmentType: body.treatmentType,
        description: body.description,
        cost: body.cost,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Treatment added successfully",
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