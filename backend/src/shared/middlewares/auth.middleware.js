"use strict";

const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../utils/app-error");


function requireAuth(req, _res, next) {
    const authHeader =
        req.headers["authorization"] ?? req.headers["Authorization"] ?? "";

    if (!authHeader.startsWith("Bearer ")) {
        return next(
            new AppError(
                "MISSING_TOKEN",
                "Access token is missing. Please log in.",
                401,
            ),
        );
    }

    const token = authHeader.slice(7);

    if (!token) {
        return next(
            new AppError(
                "MISSING_TOKEN",
                "Access token is missing. Please log in.",
                401,
            ),
        );
    }

    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(
                new AppError(
                    "TOKEN_EXPIRED",
                    "Access token has expired. Please refresh your session.",
                    401,
                ),
            );
        }

        return next(
            new AppError(
                "INVALID_TOKEN",
                "Access token is invalid. Please log in again.",
                401,
            ),
        );
    }

    req.user = {
        userId:       payload.userId,
        role:         payload.role,
        departmentId: payload.deptId ?? null,
    };

    next();
}

function requireRole(...roles) {
    return function roleGuard(req, _res, next) {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "FORBIDDEN",
                    `Access denied. Required role: ${roles.join(" or ")}.`,
                    403,
                ),
            );
        }

        next();
    };
}

function requireDepartment(req, _res, next) {
    if (req.user.role === "admin") return next();

    const userDept = req.user.departmentId;
    const resourceDept = req.resourceDepartmentId;

    if (!userDept) {
        return next(
            new AppError(
                "NO_DEPARTMENT",
                "Your account is not assigned to a department.",
                403,
            ),
        );
    }

    if (resourceDept && String(userDept) !== String(resourceDept)) {
        return next(
            new AppError(
                "DEPARTMENT_MISMATCH",
                "You do not have permission to access resources outside your department.",
                403,
            ),
        );
    }

    next();
}

function _makeOwnershipGuard(getOwnerIdFn, resourceName = "resource") {
    return async function ownershipGuard(req, _res, next) {
        try {
            if (req.user.role === "admin") return next();

            const ownerId = await getOwnerIdFn(req);

            if (ownerId === null) {
                return next(
                    new AppError(
                        "NOT_FOUND",
                        `The requested ${resourceName} does not exist.`,
                        404,
                    ),
                );
            }

            if (String(ownerId) !== String(req.user.userId)) {
                return next(
                    new AppError(
                        "FORBIDDEN",
                        `You do not have permission to access this ${resourceName}.`,
                        403,
                    ),
                );
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}

function ensureComplaintOwner(complaintRepository) {
    return _makeOwnershipGuard(async (req) => {
        const complaint = await complaintRepository.findById(req.params.id);
        if (!complaint) return null;
        req.complaint = complaint; 
        return complaint.reporter_id;
    }, "complaint");
}

function ensureVolunteerOwner(volunteerRepository) {
    return _makeOwnershipGuard(async (req) => {
        const task = await volunteerRepository.findById(req.params.id);
        if (!task) return null;
        req.volunteerTask = task; 
        return task.created_by;
    }, "volunteer task");
}

function ensureDepartmentOwner(departmentRepository) {
    return _makeOwnershipGuard(async (req) => {
        const dept = await departmentRepository.findById(req.params.id);
        if (!dept) return null;
        req.department = dept;
        return req.user.departmentId === dept.id ? req.user.userId : null;
    }, "department");
}

module.exports = {
    requireAuth,
    requireRole,
    requireDepartment,
    ensureComplaintOwner,
    ensureVolunteerOwner,
    ensureDepartmentOwner,
};
