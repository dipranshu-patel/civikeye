"use strict";

const config = require("./config");
const app = require("./app");
const { startScheduler } = require("./jobs/scheduler");

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`Base URL: http://localhost:${PORT}/api\n`);
    startScheduler();
});
