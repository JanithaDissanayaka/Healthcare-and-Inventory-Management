import { NextResponse } from "next/server";
import oracledb from "oracledb";

import { getConnection } from "@/lib/db";



export async function GET() {

  let connection;

  try {

    connection = await getConnection();



    // =====================================================
    // TOTAL PATIENTS
    // =====================================================

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



    // =====================================================
    // TOTAL DOCTORS
    // =====================================================

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



    // =====================================================
    // TOTAL APPOINTMENTS
    // =====================================================

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



    // =====================================================
    // TOTAL REVENUE
    // ADVANCED AGGREGATE QUERY
    // =====================================================

    const revenueResult =
      await connection.execute(
        `
        SELECT
          NVL(SUM(COST),0) AS TOTAL
        FROM TREATMENT
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // =====================================================
    // INNER JOIN QUERY
    // APPOINTMENT DETAILS VIEW
    // =====================================================

    const appointmentDetails =
      await connection.execute(
        `
        SELECT *
        FROM VW_APPOINTMENT_DETAILS
        ORDER BY APPOINTMENT_ID DESC
        FETCH FIRST 5 ROWS ONLY
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // =====================================================
    // LATEST PATIENTS
    // =====================================================

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



    // =====================================================
    // LATEST DOCTORS
    // =====================================================

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



    // =====================================================
    // GROUP BY QUERY
    // =====================================================

    const appointmentStats =
      await connection.execute(
        `
        SELECT
          STATUS,
          COUNT(*) AS TOTAL
        FROM APPOINTMENT
        GROUP BY STATUS
        HAVING COUNT(*) > 0
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // =====================================================
    // SUBQUERY
    // MOST ACTIVE DOCTOR
    // =====================================================

    const activeDoctor =
      await connection.execute(
        `
        SELECT NAME
        FROM DOCTOR
        WHERE DOCTOR_ID = (

            SELECT DOCTOR_ID

            FROM (

                SELECT
                    DOCTOR_ID,
                    COUNT(*) TOTAL

                FROM APPOINTMENT

                GROUP BY DOCTOR_ID

                ORDER BY COUNT(*) DESC

            )

            WHERE ROWNUM = 1

        )
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // =====================================================
    // LEFT JOIN QUERY
    // =====================================================

    const patientsWithoutAppointments =
      await connection.execute(
        `
        SELECT
          P.NAME
        FROM PATIENT P

        LEFT JOIN APPOINTMENT A
        ON P.PATIENT_ID = A.PATIENT_ID

        WHERE A.APPOINTMENT_ID IS NULL
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // =====================================================
    // FUNCTION QUERY
    // =====================================================

    const totalAppointmentsForDoctor =
      await connection.execute(
        `
        SELECT
          GET_TOTAL_APPOINTMENTS(1)
          AS TOTAL
        FROM DUAL
        `,
        [],
        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT,
        }
      );



    // =====================================================
    // ANALYTICS CHART QUERY
    // =====================================================

    const monthlyPatients =
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



      // =====================================================
      // DASHBOARD COUNTS
      // =====================================================

      totalPatients:
        (patientResult.rows?.[0] as any)?.TOTAL || 0,

      totalDoctors:
        (doctorResult.rows?.[0] as any)?.TOTAL || 0,

      totalAppointments:
        (appointmentResult.rows?.[0] as any)?.TOTAL || 0,

      totalRevenue:
        (revenueResult.rows?.[0] as any)?.TOTAL || 0,



      // =====================================================
      // DATA TABLES
      // =====================================================

      latestPatients:
        latestPatients.rows || [],

      latestDoctors:
        latestDoctors.rows || [],

      appointmentDetails:
        appointmentDetails.rows || [],

      appointmentStats:
        appointmentStats.rows || [],

      patientsWithoutAppointments:
        patientsWithoutAppointments.rows || [],



      // =====================================================
      // SUBQUERY RESULT
      // =====================================================

      mostActiveDoctor:
        activeDoctor.rows || [],



      // =====================================================
      // FUNCTION RESULT
      // =====================================================

      totalAppointmentsForDoctor:
        totalAppointmentsForDoctor.rows || [],



      // =====================================================
      // CHART DATA
      // =====================================================

      monthlyPatients:
        monthlyPatients.rows?.map((item: any) => ({
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