import { NextResponse } from "next/server";
import oracledb from "oracledb";

import { getConnection } from "@/lib/db";

export async function GET() {

  let connection;

  try {

    connection = await getConnection();

    /* TOTAL PATIENTS */
    const patientResult =
      await connection.execute(
        `
        SELECT COUNT(*) AS TOTAL
        FROM PATIENT
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    /* TOTAL DOCTORS */
    const doctorResult =
      await connection.execute(
        `
        SELECT COUNT(*) AS TOTAL
        FROM DOCTOR
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    /* TOTAL APPOINTMENTS */
    const appointmentResult =
      await connection.execute(
        `
        SELECT COUNT(*) AS TOTAL
        FROM APPOINTMENT
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    /* TOTAL REVENUE */
    const revenueResult =
      await connection.execute(
        `
        SELECT NVL(SUM(COST),0) AS TOTAL
        FROM TREATMENT
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    /* LATEST PATIENTS */
    const latestPatients =
      await connection.execute(
        `
        SELECT
          PATIENT_ID,
          NAME,
          PHONE
        FROM PATIENT
        ORDER BY PATIENT_ID DESC
        FETCH FIRST 5 ROWS ONLY
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    /* LATEST DOCTORS */
    const latestDoctors =
      await connection.execute(
        `
        SELECT
          DOCTOR_ID,
          NAME,
          SPECIALIZATION
        FROM DOCTOR
        ORDER BY DOCTOR_ID DESC
        FETCH FIRST 5 ROWS ONLY
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    /* CHART DATA */
    const weeklyPatients =
      await connection.execute(
        `
        SELECT
          TO_CHAR(DOB, 'MON') AS MONTH,
          COUNT(*) AS PATIENTS
        FROM PATIENT
        GROUP BY TO_CHAR(DOB, 'MON')
        ORDER BY MIN(DOB)
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );

    return NextResponse.json({

      totalPatients:
        (patientResult.rows?.[0] as any)?.TOTAL || 0,

      totalDoctors:
        (doctorResult.rows?.[0] as any)?.TOTAL || 0,

      totalAppointments:
        (appointmentResult.rows?.[0] as any)?.TOTAL || 0,

      totalRevenue:
        (revenueResult.rows?.[0] as any)?.TOTAL || 0,

      latestPatients:
        latestPatients.rows || [],

      latestDoctors:
        latestDoctors.rows || [],

      weeklyPatients:
        weeklyPatients.rows?.map((item: any) => ({
          month: item.MONTH,
          patients: item.PATIENTS,
        })) || [],

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