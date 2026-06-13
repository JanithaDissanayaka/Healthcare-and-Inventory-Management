import oracledb from "oracledb";

export async function getConnection() {
  const conn = await oracledb.getConnection({
    user: "system",
    password: "oracle123",
    connectString: "localhost:1521/XEPDB1",
  });

  const result = await conn.execute(
    `SELECT USER FROM DUAL`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  console.log("CONNECTED USER => ", result.rows);

  return conn;
}