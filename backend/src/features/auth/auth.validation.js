"use strict";

const CONSTRAINTS = {
    fullName: {
        minLength: 2,
        maxLength: 100,
    },
    password: {
        minLength: 8,
        maxLength: 128,
    },
    otp: {
        length: 6,
    },
};

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,24}$/;

    return (
        typeof email === "string" &&
        emailRegex.test(email.trim()) &&
        !email.includes("..")
    );
}

function checkPassword(password) {
    if (typeof password !== "string") {
        return { valid: false, reason: "Password must be a string." };
    }

    const { minLength, maxLength } = CONSTRAINTS.password;

    if (password.length < minLength) {
        return {
            valid: false,
            reason: `Password must be at least ${minLength} characters long.`,
        };
    }

    if (password.length > maxLength) {
        return {
            valid: false,
            reason: `Password must not exceed ${maxLength} characters.`,
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain at least one uppercase letter.",
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain at least one lowercase letter.",
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain at least one digit.",
        };
    }

    return { valid: true };
}

function validateRegister(body) {
    const errors = [];
    const { fullName, email, password, latitude, longitude } = body ?? {};

    if (!isNonEmptyString(fullName)) {
        errors.push({ field: "fullName", message: "Full name is required." });
    } else {
        const trimmed = fullName.trim();
        const { minLength, maxLength } = CONSTRAINTS.fullName;

        if (trimmed.length < minLength) {
            errors.push({
                field: "fullName",
                message: `Full name must be at least ${minLength} characters long.`,
            });
        } else if (trimmed.length > maxLength) {
            errors.push({
                field: "fullName",
                message: `Full name must not exceed ${maxLength} characters.`,
            });
        }
    }

    if (!isNonEmptyString(email)) {
        errors.push({ field: "email", message: "Email address is required." });
    } else if (!isValidEmail(email)) {
        errors.push({
            field: "email",
            message: "Please provide a valid email address.",
        });
    }

    if (!isNonEmptyString(password)) {
        errors.push({ field: "password", message: "Password is required." });
    } else {
        const result = checkPassword(password);
        if (!result.valid) {
            errors.push({ field: "password", message: result.reason });
        }
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (latitude === undefined || latitude === null || isNaN(lat)) {
        errors.push({ field: "latitude", message: "Location is required. Please allow location access." });
    } else if (lat < -90 || lat > 90) {
        errors.push({ field: "latitude", message: "Latitude must be between -90 and 90." });
    }

    if (longitude === undefined || longitude === null || isNaN(lng)) {
        errors.push({ field: "longitude", message: "Location is required. Please allow location access." });
    } else if (lng < -180 || lng > 180) {
        errors.push({ field: "longitude", message: "Longitude must be between -180 and 180." });
    }

    return errors;
}

function validateLogin(body) {
    const errors = [];
    const { email, password } = body ?? {};

    if (!isNonEmptyString(email)) {
        errors.push({ field: "email", message: "Email address is required." });
    } else if (!isValidEmail(email)) {
        errors.push({
            field: "email",
            message: "Please provide a valid email address.",
        });
    }

    if (!isNonEmptyString(password)) {
        errors.push({ field: "password", message: "Password is required." });
    }

    return errors;
}

function validateRefresh(body) {
    const errors = [];
    const { refreshToken } = body ?? {};

    if (!isNonEmptyString(refreshToken)) {
        errors.push({
            field: "refreshToken",
            message: "Refresh token is required.",
        });
    }

    return errors;
}

function validateLogout(body) {
    const errors = [];
    const { refreshToken } = body ?? {};

    if (!isNonEmptyString(refreshToken)) {
        errors.push({
            field: "refreshToken",
            message: "Refresh token is required.",
        });
    }

    return errors;
}

function validateSendOtp(body) {
    const errors = [];
    const { email } = body ?? {};

    if (!isNonEmptyString(email)) {
        errors.push({ field: "email", message: "Email address is required." });
    } else if (!isValidEmail(email)) {
        errors.push({
            field: "email",
            message: "Please provide a valid email address.",
        });
    }
    return errors;
}

function validateVerifyOtp(body) {
    const errors = [];
    const { email, otp } = body ?? {};

    if (!isNonEmptyString(email)) {
        errors.push({ field: "email", message: "Email address is required." });
    } else if (!isValidEmail(email)) {
        errors.push({
            field: "email",
            message: "Please provide a valid email address.",
        });
    }

    const { length } = CONSTRAINTS.otp;
    if (!isNonEmptyString(otp)) {
        errors.push({ field: "otp", message: "OTP is required." });
    } else if (!/^\d{6}$/.test(otp.trim())) {
        errors.push({
            field: "otp",
            message: `OTP must be exactly ${length} digits.`,
        });
    }

    return errors;
}

function validateForgotPassword(body) {
    const errors = [];
    const { email } = body ?? {};

    if (!isNonEmptyString(email)) {
        errors.push({ field: "email", message: "Email address is required." });
    } else if (!isValidEmail(email)) {
        errors.push({
            field: "email",
            message: "Please provide a valid email address.",
        });
    }

    return errors;
}

function validateResetPassword(body) {
    const errors = [];
    const { token, password } = body ?? {};

    if (!isNonEmptyString(token)) {
        errors.push({ field: "token", message: "Reset token is required." });
    }

    if (!isNonEmptyString(password)) {
        errors.push({ field: "password", message: "Password is required." });
    } else {
        const result = checkPassword(password);
        if (!result.valid) {
            errors.push({ field: "password", message: result.reason });
        }
    }

    return errors;
}

module.exports = {
    validateRegister,
    validateLogin,
    validateRefresh,
    validateLogout,
    validateSendOtp,
    validateVerifyOtp,
    validateForgotPassword,
    validateResetPassword,

    CONSTRAINTS,
};
