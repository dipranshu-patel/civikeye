"use strict";

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`Base URL: http://localhost:${PORT}/api\n`);
});