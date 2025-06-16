const { Pool } = require('pg');

// Log database configuration (without sensitive data)
console.log('Database configuration:', {
    host: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'not configured',
    ssl: process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled',
    environment: process.env.NODE_ENV
});

// Configure the connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { 
        rejectUnauthorized: false,
        sslmode: 'require'
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    application_name: 'shoplicity-api'
});

// Test the connection
pool.on('connect', (client) => {
    console.log('New client connected to database');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    process.exit(-1);
});

// Helper function to execute queries with retry logic
const query = async (text, params, retries = 3) => {
    const start = Date.now();
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { 
                text, 
                duration, 
                rows: res.rowCount,
                attempt: i + 1
            });
            return res;
        } catch (error) {
            lastError = error;
            console.error('Query execution failed', {
                text,
                error: error.message,
                attempt: i + 1,
                timestamp: new Date().toISOString()
            });

            // If it's a connection error and we have retries left, wait before retrying
            if (i < retries - 1 && (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT')) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                continue;
            }
            throw error;
        }
    }

    throw lastError;
};

// Test the database connection
const testConnection = async () => {
    try {
        const result = await query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection test failed:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return false;
    }
};

// Run the connection test
testConnection();

module.exports = {
    query,
    pool,
    testConnection
}; 