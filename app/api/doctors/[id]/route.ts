// app/api/doctors/route.ts
export async function GET() {
  try {
    const doctors = await executeQuery(`
      SELECT 
        doctor_id AS ID, 
        name, 
        specialization, 
        phone, 
        email, 
        salary, 
        created_at
      FROM doctors
      ORDER BY doctor_id DESC
    `);

    const activeDutySummary = await executeQuery(`
      SELECT COUNT(DISTINCT doctor_id) AS ACTIVE_COUNT 
      FROM appointments 
      WHERE status IN ('PENDING', 'COMPLETED')
    `);

    // Ensure this returns an object with array inside
    return NextResponse.json({
      doctorsList: doctors || [],
      activeOnDuty: activeDutySummary[0]?.ACTIVE_COUNT || 0
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}