import { NextResponse } from "next/server";
import oracledb from "oracledb";
import { getConnection } from "@/lib/db";



// ======================================
// GET ALL APPOINTMENTS
// ======================================
export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
        a.APPOINTMENT_ID,

        p.FIRST_NAME || ' ' || p.LAST_NAME
        AS PATIENT_NAME,

        d.DOCTOR_NAME
        AS DOCTOR_NAME,

        a.APPOINTMENT_DATE,

        a.STATUS

      FROM APPOINTMENT a

      INNER JOIN PATIENT p
        ON a.PATIENT_ID = p.PATIENT_ID

      INNER JOIN DOCTOR d
        ON a.DOCTOR_ID = d.DOCTOR_ID

      ORDER BY a.APPOINTMENT_ID DESC
      `,
      [],
      {
        outFormat:
          oracledb.OUT_FORMAT_OBJECT,
      }
    );



    // ANALYTICS
    const analyticsResult =
      await connection.execute(
        `
        SELECT
          d.DOCTOR_NAME,
          COUNT(a.APPOINTMENT_ID)
          AS TOTAL_APPOINTMENTS

        FROM DOCTOR d

        LEFT JOIN APPOINTMENT a
          ON d.DOCTOR_ID =
             a.DOCTOR_ID

        GROUP BY d.DOCTOR_NAME

        ORDER BY
          TOTAL_APPOINTMENTS DESC
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // BUSY DOCTORS
    const busyDoctors =
      await connection.execute(
        `
        SELECT DOCTOR_NAME
        FROM DOCTOR
        WHERE DOCTOR_ID IN
        (
          SELECT DOCTOR_ID
          FROM APPOINTMENT
          GROUP BY DOCTOR_ID
          HAVING COUNT(*) > 5
        )
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    return NextResponse.json({
      appointments:
        result.rows || [],

      analytics:
        analyticsResult.rows || [],

      busyDoctors:
        busyDoctors.rows || [],
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



// ======================================
// ADD APPOINTMENT
// ======================================
export async function POST(
  req: Request
) {

  let connection;

  try {

    const body =
      await req.json();

    connection =
      await getConnection();



    await connection.execute(
      `
      INSERT INTO APPOINTMENT
      (
        APPOINTMENT_ID,
        PATIENT_ID,
        DOCTOR_ID,
        APPOINTMENT_DATE,
        STATUS
      )
      VALUES
      (
        APPOINTMENT_SEQ.NEXTVAL,
        :patientId,
        :doctorId,
        TO_DATE(:dateValue,'YYYY-MM-DD'),
        :status
      )
      `,
      {
        patientId:
          body.patientId,

        doctorId:
          body.doctorId,

        dateValue:
          body.date,

        status:
          body.status,
      },
      {
        autoCommit: true,
      }
    );



    return NextResponse.json({
      message:
        "Appointment added successfully",
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