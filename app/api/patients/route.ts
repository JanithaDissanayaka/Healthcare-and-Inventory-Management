import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";

/* GET ALL PATIENTS */
export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const patientResult = await connection.execute(
      `
      SELECT
        PATIENTID AS PATIENT_ID,
        FIRSTNAME || ' ' || LASTNAME AS NAME,
        DOB,
        GENDER,
        '' AS PHONE,
        '' AS ADDRESS
      FROM PATIENT
      ORDER BY PATIENTID DESC
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const genderResult = await connection.execute(
      `
      SELECT
        GENDER,
        COUNT(*) AS TOTAL
      FROM PATIENT
      GROUP BY GENDER
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json({
      patients: patientResult.rows || [],
      genderStats: genderResult.rows || [],
      activePatients: [],
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch patients",
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

/* INSERT PATIENT */
export async function POST(req: Request) {
  let connection;

  try {
    const body = await req.json();

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT NVL(MAX(PATIENTID),0)+1 AS NEW_ID
      FROM PATIENT
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    const patientId = (result.rows?.[0] as any).NEW_ID;

    await connection.execute(
      `
      INSERT INTO PATIENT
      (
        PATIENTID,
        FIRSTNAME,
        LASTNAME,
        GENDER,
        DOB,
        DISEASE,
        ADMITDATE,
        HOSPITALID
      )
      VALUES
      (
        :patientId,
        :firstName,
        :lastName,
        :gender,
        TO_DATE(:dob,'YYYY-MM-DD'),
        :disease,
        SYSDATE,
        :hospitalId
      )
      `,
      {
        patientId,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dob: body.dob,
        disease: "General",
        hospitalId: 1,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Patient added successfully",
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