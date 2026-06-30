"use strict";

const repo = require("./me.repository");
const AppError = require("../../shared/utils/app-error");

async function updateLocation(userId, body) {
    const lat = parseFloat(body.latitude);
    const lng = parseFloat(body.longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new AppError(
            "INVALID_COORDINATES",
            "The provided coordinates are invalid.",
            422,
        );
    }

    const updated = await repo.updateUserLocation(userId, {
        latitude: lat,
        longitude: lng,
    });

    if (!updated) {
        throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    }

    return {
        id: updated.id,
        fullName: updated.full_name,
        email: updated.email,
        role: updated.role,
        location: {
            latitude: parseFloat(updated.latitude),
            longitude: parseFloat(updated.longitude),
        },
    };
}

async function getProfile(userId) {
    const user = await repo.findUserById(userId);

    if (!user) {
        throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    }

    return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        location: user.latitude
            ? {
                  latitude: parseFloat(user.latitude),
                  longitude: parseFloat(user.longitude),
              }
            : null,
        createdAt: user.created_at,
    };
}

async function togglePrivacy(userId) {
    const volunteerRepo = require("../volunteer/volunteer.repository");
    const showRealName  = await volunteerRepo.togglePrivacy(userId);
    if (showRealName === null) {
        throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    }
    return { showRealName };
}

module.exports = { updateLocation, getProfile, togglePrivacy };
