#!/usr/bin/env node
"use strict";

/**
 * scripts/migrate.js
 *
 * Runs all numbered SQL migrations in order.
 * Tracks which have been applied in the schema_migrations table.
 *
 * Usage:
 *   node scripts/migrate.js
 *
 * Prerequisites:
 *   - schema_migrations table must exist (run 020_schema_migrations.sql once manually).
 *   - DATABASE_URL or individual DB env vars must be set in .env
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const fs   = require("fs");
const path = require("path");
const { Pool } = require("pg");

const MIGRATIONS_DIR = path.resolve(__dirname, "../src/shared/db/migrations");

async function run() {
    const pool = new Pool({
        host:     process.env.DB_HOST,
        port:     parseInt(process.env.DB_PORT ?? "5432", 10),
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    const client = await pool.connect();

    try {
        // Load already-applied migrations
        const { rows: applied } = await client.query(
            "SELECT filename FROM schema_migrations ORDER BY filename",
        );
        const appliedSet = new Set(applied.map((r) => r.filename));

        // Read migration files sorted alphabetically (001_, 002_, ...)
        const files = fs
            .readdirSync(MIGRATIONS_DIR)
            .filter((f) => f.endsWith(".sql"))
            .sort();

        let ran = 0;

        for (const file of files) {
            if (appliedSet.has(file)) {
                console.log(`  ⏭  skip  ${file}`);
                continue;
            }

            const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

            console.log(`  ▶  run   ${file}`);
            await client.query("BEGIN");
            try {
                await client.query(sql);
                await client.query(
                    "INSERT INTO schema_migrations (filename) VALUES ($1)",
                    [file],
                );
                await client.query("COMMIT");
                console.log(`  ✓  done  ${file}`);
                ran++;
            } catch (err) {
                await client.query("ROLLBACK");
                console.error(`  ✗  FAIL  ${file}`);
                console.error(`           ${err.message}`);
                process.exit(1);
            }
        }

        if (ran === 0) {
            console.log("\nAll migrations are already applied. Nothing to do.\n");
        } else {
            console.log(`\n✅ ${ran} migration(s) applied successfully.\n`);
        }
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch((err) => {
    console.error("Migration runner failed:", err.message);
    process.exit(1);
});
