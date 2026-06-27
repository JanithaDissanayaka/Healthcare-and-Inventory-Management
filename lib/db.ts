import oracledb from "oracledb";

// Return rows as objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Database configuration
const dbConfig: oracledb.ConnectionAttributes = {
  user: process.env.DB_USER || "SYSTEM",
  password: process.env.DB_PASSWORD || "viduranga",
  connectString:
    process.env.DB_CONNECT_STRING || "localhost:1521/XEPDB1",
};

export { pool };

export async function executeQuery<T = any>(
  sql: string,
  binds: oracledb.BindParameters = {}
): Promise<T[]> {
  let connection: oracledb.Connection | undefined;

  try {
    console.log("🔗 Connecting to Oracle...");
    console.log({
      user: dbConfig.user,
      connectString: dbConfig.connectString,
    });

    connection = await oracledb.getConnection(dbConfig);

    console.log("✅ Oracle Connected");

    const result = await connection.execute(sql, binds, {
      autoCommit: true,
    });

    return (result.rows as T[]) || [];
  } catch (error: any) {
    console.error("❌ Oracle Error:");
    console.error(error);

    throw new Error(
      error?.message || "Database connection/query failed"
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("🔒 Oracle Connection Closed");
      } catch (closeError) {
        console.error(
          "❌ Error closing Oracle connection:",
          closeError
        );
      }
    }
  }
}

// Add this line at the bottom of your lib/db.ts
