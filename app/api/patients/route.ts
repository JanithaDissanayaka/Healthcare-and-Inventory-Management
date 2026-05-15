import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";



// ===============================
// GET ALL PATIENTS
// ===============================
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const patients = await connection.execute(
      `
      SELECT
        PATIENT_ID,
        FIRST_NAME || ' ' || LAST_NAME AS NAME,
        DOB,
        GENDER,
        PHONE,
        ADDRESS
      FROM PATIENT
      ORDER BY PATIENT_ID DESC
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );



    const genderStats = await connection.execute(
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



    const activePatients = await connection.execute(
      `
      SELECT
        FIRST_NAME || ' ' || LAST_NAME AS NAME
      FROM PATIENT
      WHERE PATIENT_ID IN
      (
        SELECT PATIENT_ID
        FROM APPOINTMENT
      )
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );



    return NextResponse.json({
      patients: patients.rows || [],
      genderStats: genderStats.rows || [],
      activePatients: activePatients.rows || [],
    });

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
// ADD PATIENT
// ===============================
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();



    await connection.execute(
      `
      INSERT INTO PATIENT
      (
        PATIENT_ID,
        FIRST_NAME,
        LAST_NAME,
        DOB,
        GENDER,
        PHONE,
        ADDRESS,
        BLOOD_GROUP
      )
      VALUES
      (
        PATIENT_SEQ.NEXTVAL,
        :firstName,
        :lastName,
        TO_DATE(:dob, 'YYYY-MM-DD'),
        :gender,
        :phone,
        :address,
        :bloodGroup
      )
      `,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        dob: body.dob,
        gender: body.gender.toUpperCase(),
        phone: body.phone,
        address: body.address,
        bloodGroup: body.bloodGroup,
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