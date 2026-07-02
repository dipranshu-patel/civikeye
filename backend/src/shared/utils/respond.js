"use strict";

function sendSuccess(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
}

function sendError(res, code, message, status = 500) {
    return res
        .status(status)
        .json({ success: false, error: { code, message } });
}

module.exports = { sendSuccess, sendError };
