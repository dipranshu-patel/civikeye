const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("connect", () => {
    console.log("PostgreSQL pool: new client connected");
});

pool.on("error", (err) => {
    console.error("PostgreSQL pool: unexpected error on idle client", err);
    process.exit(1);
});

module.exports = pool;