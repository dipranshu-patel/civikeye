"use strict";

function validateAddress(body) {
    const errors = [];
    const { latitude, longitude } = body ?? {};

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (latitude === undefined || latitude === null || isNaN(lat)) {
        errors.push({ field: "latitude", message: "Latitude is required." });
    } else if (lat < -90 || lat > 90) {
        errors.push({ field: "latitude", message: "Latitude must be between -90 and 90." });
    }

    if (longitude === undefined || longitude === null || isNaN(lng)) {
        errors.push({ field: "longitude", message: "Longitude is required." });
    } else if (lng < -180 || lng > 180) {
        errors.push({ field: "longitude", message: "Longitude must be between -180 and 180." });
    }

    return errors;
}

module.exports = { validateAddress };
