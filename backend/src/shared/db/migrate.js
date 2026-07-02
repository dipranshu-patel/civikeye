"use strict";

const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function run() {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                filename   TEXT        PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const { rows: applied } = await client.query(
            "SELECT filename FROM schema_migrations ORDER BY filename",
        );
        const appliedSet = new Set(applied.map((r) => r.filename));

        const files = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter((f) => f.endsWith(".sql"))
            .sort();

        const pending = files.filter((f) => !appliedSet.has(f));

        if (pending.length === 0) {
            console.log("No pending migrations. Database is up to date.");
            return;
        }

        console.log(`${pending.length} pending migration(s):`);

        for (const filename of pending) {
            const filePath = path.join(MIGRATIONS_DIR, filename);
            const sql = fs.readFileSync(filePath, "utf8");

            process.stdout.write(`Running ${filename}...`);

            try {
                await client.query("BEGIN");
                await client.query(sql);
                await client.query(
                    "INSERT INTO schema_migrations (filename) VALUES ($1)",
                    [filename],
                );
                await client.query("COMMIT");
                console.log("done");
            } catch (err) {
                await client.query("ROLLBACK");
                console.error(`\nFAILED: ${filename}`);
                console.error(err.message);
                process.exit(1);
            }
        }

        console.log("All migrations applied successfully.");
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch((err) => {
    console.error("Fatal migration error:", err);
    process.exit(1);
});
