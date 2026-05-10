import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";

export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    // Total Patients
    const patientResult = await connection.execute(
      `SELECT COUNT(*) AS TOTAL FROM PATIENT`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    // Total Doctors
    const doctorResult = await connection.execute(
      `SELECT COUNT(*) AS TOTAL FROM DOCTOR`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    // Latest Patients
    const latestPatients = await connection.execute(
      `
      SELECT *
      FROM PATIENT
      ORDER BY PATIENT_ID DESC
      FETCH FIRST 5 ROWS ONLY
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    // Latest Doctors
    const latestDoctors = await connection.execute(
      `
      SELECT *
      FROM DOCTOR
      ORDER BY DOCTOR_ID DESC
      FETCH FIRST 5 ROWS ONLY
      `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    return NextResponse.json({
      totalPatients: patientResult.rows?.[0]?.TOTAL || 0,
      totalDoctors: doctorResult.rows?.[0]?.TOTAL || 0,
      latestPatients: latestPatients.rows || [],
      latestDoctors: latestDoctors.rows || [],
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Dashboard error",
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