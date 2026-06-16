import oracledb from 'oracledb';

// Tell the driver to return rows as JavaScript objects rather than arrays [value1, value2]
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Database connection configuration details
const dbConfig = {
  user: process.env.DB_USER || 'system',
  password: process.env.DB_PASSWORD || 'YourPassword123', // Matches your docker run password
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/XEPDB1', // Direct to Pluggable DB
};

/**
 * Utility function to execute SQL queries on the fresh Oracle container.
 * Automatically handles opening and closing connections to prevent leaks.
 * 
 * @param sql The SQL query string to execute
 * @param binds Optional bind variables to prevent SQL injection
 */
export async function executeQuery<T = any>(
  sql: string, 
  binds: oracledb.BindParameters = []
): Promise<T[]> {
  let connection;

  try {
    // Open a fresh connection
    connection = await oracledb.getConnection(dbConfig);
    
    // Execute the query
    const result = await connection.execute(sql, binds, {
      autoCommit: true // Automatically commit INSERTs/UPDATEs/DELETEs
    });

    // Return the query rows or an empty array if none
    return (result.rows as T[]) || [];

  } catch (error) {
    console.error('❌ Database query execution error:', error);
    throw error;
  } finally {
    // Crucial: Always close the connection when done so you don't exhaust pool limits
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}