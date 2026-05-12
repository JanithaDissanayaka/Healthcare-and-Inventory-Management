import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";


// GET ALL APPOINTMENTS
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        a.APPOINTMENT_ID,
        p.NAME AS PATIENT_NAME,
        d.NAME AS DOCTOR_NAME,
        a.CLINIC_ID,
        a.APPOINTMENT_DATE,
        a.APPOINTMENT_TIME,
        a.STATUS
      FROM APPOINTMENT a
      JOIN PATIENT p
        ON a.PATIENT_ID = p.PATIENT_ID
      JOIN DOCTOR d
        ON a.DOCTOR_ID = d.DOCTOR_ID
      ORDER BY a.APPOINTMENT_ID DESC
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



// ADD APPOINTMENT
export async function POST(req: Request) {

  let connection;

  try {

    const body = await req.json();

    connection = await getConnection();

    await connection.execute(
      `
      INSERT INTO APPOINTMENT
      (
        PATIENT_ID,
        DOCTOR_ID,
        CLINIC_ID,
        APPOINTMENT_DATE,
        APPOINTMENT_TIME,
        STATUS
      )
      VALUES
      (
        :patientId,
        :doctorId,
        :clinicId,
        TO_DATE(:dateValue, 'YYYY-MM-DD'),
        :timeValue,
        :status
      )
      `,
      {
        patientId: body.patientId,
        doctorId: body.doctorId,
        clinicId: body.clinicId,
        dateValue: body.date,
        timeValue: body.time,
        status: body.status,
      },
      {
        autoCommit: true,
      }
    );

    return NextResponse.json({
      message: "Appointment added successfully",
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