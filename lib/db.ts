import oracledb from "oracledb";

export async function getConnection() {
  return await oracledb.getConnection({
    user: "system",
    password: "oracle123",
    connectString: "localhost:1521/XEPDB1",
  });
}