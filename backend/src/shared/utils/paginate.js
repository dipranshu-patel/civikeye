"use strict";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parsePaginationParams(query) {
    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

function buildPaginationResponse(items, total, page, limit) {
    const totalPages = Math.ceil(total / limit) || 1;

    return {
        items,
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
    };
}

module.exports = { parsePaginationParams, buildPaginationResponse };
