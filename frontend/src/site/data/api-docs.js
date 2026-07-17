export const apiCategories = [
    {
        title: "Authentication",
        id: "auth",
        description: "Endpoints for managing user sessions and registration.",
        endpoints: [
            {
                method: "POST",
                path: "/api/auth/register",
                description:
                    "Registers a new citizen user account. Location is mandatory - latitude and longitude are required at signup to enable location-based features like nearby complaints and volunteer tasks. Passwords must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit.",
                requiresAuth: false,
                requestBody: {
                    fullName: "Amit Patel",
                    email: "amit@example.com",
                    password: "SecurePass123",
                    latitude: 40.7128,
                    longitude: -74.006,
                },
                responseBody: {
                    success: true,
                    data: {
                        user: {
                            id: "u123",
                            fullName: "Amit Patel",
                            email: "amit@example.com",
                            role: "citizen",
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/api/auth/login",
                description:
                    "Authenticates a user with their email and password. On success, returns a short-lived JWT access token in the response body and sets an httpOnly refreshToken cookie (valid for 30 days) for silent token renewal. The access token should be sent in the Authorization header as 'Bearer <token>' for all protected requests.",
                requiresAuth: false,
                requestBody: {
                    email: "user@example.com",
                    password: "SecurePass123",
                },
                responseBody: {
                    success: true,
                    data: {
                        accessToken: "eyJhbGciOi...",
                        user: {
                            id: "u1",
                            fullName: "Amit Patel",
                            role: "citizen",
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/api/auth/send-otp",
                description:
                    "Sends a 6-digit one-time password (OTP) to the specified email address. Used to verify email ownership before account registration. The OTP expires after 10 minutes. Rate-limited to prevent abuse.",
                requiresAuth: false,
                requestBody: { email: "user@example.com" },
                responseBody: {
                    success: true,
                    message: "OTP sent successfully",
                },
            },
            {
                method: "POST",
                path: "/api/auth/verify-otp",
                description:
                    "Verifies the 6-digit OTP sent to the user's email. The OTP must be exactly 6 numeric digits and must be used within 10 minutes of being sent. Once verified, the email is confirmed for registration.",
                requiresAuth: false,
                requestBody: { email: "user@example.com", otp: "123456" },
                responseBody: { success: true, message: "Email verified" },
            },
            {
                method: "POST",
                path: "/api/auth/refresh",
                description:
                    "Issues a new access token using the httpOnly refreshToken cookie. No request body is needed. The old refresh token is rotated (replaced) on every call for security. If the refresh token is expired or missing, the client should redirect the user to login.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { accessToken: "eyJhbGciOi..." },
                },
            },
            {
                method: "POST",
                path: "/api/auth/logout",
                description:
                    "Logs out the user by invalidating the current refresh token in the database and clearing the refreshToken cookie. The access token cannot be revoked server-side (it expires naturally), so clients should also clear it from memory on logout.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    message: "Logged out successfully.",
                },
            },
            {
                method: "POST",
                path: "/api/auth/forgot-password",
                description:
                    "Initiates the password reset flow by sending a reset link to the given email. For security, the response is always the same regardless of whether the email exists in the system - this prevents account enumeration attacks. The reset link is valid for 15 minutes.",
                requiresAuth: false,
                requestBody: { email: "user@example.com" },
                responseBody: {
                    success: true,
                    message:
                        "If an account exists, a password reset link has been sent.",
                },
            },
            {
                method: "POST",
                path: "/api/auth/reset-password",
                description:
                    "Completes the password reset flow using the token from the reset email link. The token is single-use and expires after 15 minutes. The new password must meet the same strength requirements as registration (min 8 chars, uppercase, lowercase, digit). After reset, the user must log in again.",
                requiresAuth: false,
                requestBody: {
                    token: "reset-token-xyz",
                    password: "NewSecurePass123",
                },
                responseBody: {
                    success: true,
                    message:
                        "Password has been reset successfully. Please log in with your new password.",
                },
            },
        ],
    },
    {
        title: "Current User (Me)",
        id: "me",
        description:
            "Endpoints for the authenticated user to manage their own profile and settings.",
        endpoints: [
            {
                method: "GET",
                path: "/api/me",
                description:
                    "Returns the complete, private profile for the currently authenticated user. This includes personally identifiable information (email, full name), their home location, contribution statistics (complaints filed, upvotes, verifications), community verification badge status, and all notification/privacy preferences. This data is never exposed to other users - use /api/users/:id/profile for public-facing profiles.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        user: {
                            id: "u1",
                            fullName: "Amit Patel",
                            email: "amit@example.com",
                            role: "citizen",
                            location: { latitude: 40.71, longitude: -74.0 },
                            communityVerification: "visible",
                            contributionSummary: {
                                complaintsField: 5,
                                upvotesCast: 12,
                                verificationsCast: 3,
                                tasksCompleted: 1,
                                civicPoints: 250,
                            },
                            preferences: {
                                showNameOnComplaints: true,
                                appearOnLeaderboard: true,
                                showContributionHistory: false,
                                updatedAt: "2026-01-15T10:30:00+05:30",
                            },
                        },
                    },
                },
            },
            {
                method: "PATCH",
                path: "/api/me/profile",
                description:
                    "Updates the user's display name (fullName). Only fullName can be changed via this endpoint. To change the email address, use the dedicated /request-email-change and /confirm-email-change flow, which requires OTP verification to prevent unauthorized email takeovers.",
                requiresAuth: true,
                requestBody: { fullName: "Amit Patel" },
                responseBody: {
                    success: true,
                    data: {
                        user: {
                            id: "u1",
                            fullName: "Amit Patel",
                            email: "amit@example.com",
                        },
                    },
                },
            },
            {
                method: "PATCH",
                path: "/api/me/location",
                description:
                    "Updates the user's home location using raw geographic coordinates. This location is used for proximity-based features such as finding nearby complaints, discovering volunteer tasks in the area, and verifying field reports. Latitude must be between -90 and 90, and longitude between -180 and 180.",
                requiresAuth: true,
                requestBody: { latitude: 40.71, longitude: -74.0 },
                responseBody: {
                    success: true,
                    data: {
                        user: {
                            id: "u1",
                            fullName: "Amit Patel",
                            email: "amit@example.com",
                            role: "citizen",
                            location: { latitude: 40.71, longitude: -74.0 },
                        },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/me/preferences",
                description:
                    "Retrieves the user's current notification and privacy preferences. showNameOnComplaints controls whether the user's name appears on their complaints (or shows as Anonymous). appearOnLeaderboard controls visibility in the volunteer leaderboard. showContributionHistory controls whether other users can see their stats.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        preferences: {
                            showNameOnComplaints: true,
                            appearOnLeaderboard: true,
                            showContributionHistory: false,
                            updatedAt: "2026-01-15T10:30:00+05:30",
                        },
                    },
                },
            },
            {
                method: "PATCH",
                path: "/api/me/preferences",
                description:
                    "Updates one or more user preferences. You only need to send the fields you want to change - omitted fields remain unchanged. These preferences affect how the user's data appears to others across the platform, including complaint attribution and leaderboard visibility.",
                requiresAuth: true,
                requestBody: {
                    showNameOnComplaints: false,
                    appearOnLeaderboard: true,
                },
                responseBody: {
                    success: true,
                    data: {
                        preferences: {
                            showNameOnComplaints: false,
                            appearOnLeaderboard: true,
                            showContributionHistory: false,
                            updatedAt: "2026-01-15T11:00:00+05:30",
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/api/me/change-password",
                description:
                    "Changes the authenticated user's password. Requires the current password to be provided for security verification before accepting the new one. The new password must be at least 8 characters and differ from the current one. After a successful password change, the passwordChangedAt timestamp is updated, which may cause existing sessions to be invalidated depending on security policy.",
                requiresAuth: true,
                requestBody: {
                    currentPassword: "OldPass123",
                    newPassword: "NewPass456",
                },
                responseBody: {
                    success: true,
                    data: { passwordChangedAt: "2026-01-15T11:00:00+05:30" },
                },
            },
            {
                method: "DELETE",
                path: "/api/me/account",
                description:
                    "Initiates a soft-deletion of the user's account. To prevent accidental deletion, the request body must include the string 'delete' as the confirmation field. The account is soft-deleted - data is anonymized and retained for audit purposes but the user can no longer log in. This action cannot be undone.",
                requiresAuth: true,
                requestBody: { confirmation: "delete" },
                responseBody: {
                    success: true,
                    data: { deleted: true },
                },
            },
            {
                method: "POST",
                path: "/api/me/request-email-change",
                description:
                    "Initiates a secure email address change by sending a 6-digit OTP to the new (desired) email address. The OTP expires in 10 minutes and is limited to 5 attempts. This two-step process ensures the user has access to the new email before the change is applied. The current email is not changed until /confirm-email-change is called.",
                requiresAuth: true,
                requestBody: { newEmail: "newemail@example.com" },
                responseBody: { success: true, data: { success: true } },
            },
            {
                method: "POST",
                path: "/api/me/confirm-email-change",
                description:
                    "Completes the email change by verifying the OTP that was sent to the new address. Only the OTP is required in the body - the new email is looked up from the pending change request. If successful, the user's email is updated and the pending OTP record is cleared.",
                requiresAuth: true,
                requestBody: { otp: "123456" },
                responseBody: {
                    success: true,
                    data: {
                        user: {
                            id: "u1",
                            fullName: "Amit Patel",
                            email: "newemail@example.com",
                        },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/me/verifications",
                description:
                    "Returns a list of pending verification tasks assigned to this user based on their home location. Requires that the user has set a location (requiresUserLocation middleware). Supports optional query params: tab (pending|completed), filter, search. Citizens use these to confirm or deny that a reported complaint has been resolved in their neighborhood.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { verifications: [], total: 0 },
                },
            },
            {
                method: "GET",
                path: "/api/me/complaints",
                description:
                    "Returns a paginated list of all complaints submitted by the currently authenticated user. Useful for building a personal 'My Complaints' dashboard. Supports query params: tab (open|in_progress|resolved|etc.), search (title text), sort (newest|oldest), page, and limit.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        complaints: [],
                        pagination: { page: 1, limit: 20, total: 0 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/me/dashboard",
                description:
                    "Returns high-level civic engagement statistics for the authenticated citizen, useful for rendering a personal dashboard. Includes counts of complaints by status, upvotes received, and verification activity.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        stats: {
                            totalComplaints: 5,
                            resolvedComplaints: 3,
                            pendingComplaints: 2,
                        },
                    },
                },
            },
        ],
    },
    {
        title: "Complaints",
        id: "complaints",
        description:
            "Endpoints for creating, fetching, and interacting with civic complaints.",
        endpoints: [
            {
                method: "GET",
                path: "/api/complaints",
                description:
                    "Fetches a paginated list of public complaints with rich filtering and sorting support. Useful for building an 'Explore' feed. Available query params: search (text search on title/description), status (open|in_progress|resolved|etc.), issue_type, category_id, department_id, sort (newest|most_upvoted|nearest), page, limit. Default page size is 20.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        complaints: [
                            {
                                id: "c123",
                                title: "Pothole on Main St",
                                status: "open",
                                issueType: "infrastructure",
                                upvotes: 15,
                                location: { latitude: 40.71, longitude: -74.0 },
                            },
                        ],
                        pagination: { page: 1, limit: 20, total: 100 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/complaints/nearby",
                description:
                    "Returns complaints within a configurable radius of a geographic point. Required query params: lat, lng. Radius 1000m. Results are sorted by distance from the center point.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { complaints: [] },
                },
            },
            {
                method: "GET",
                path: "/api/complaints/similar",
                description:
                    "Finds existing complaints that are similar in nature to a potential new report. Used to prevent duplicate submissions. All three query params are required: lat (latitude), lng (longitude), and category_id. Returns complaints in the same category within a proximity threshold.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { complaints: [] },
                },
            },
            {
                method: "GET",
                path: "/api/complaints/:id",
                description:
                    "Returns complete details for a single complaint by its UUID. Works for public (unauthenticated) visitors. If a valid Bearer token is provided, the response also includes a userUpvoted boolean indicating whether the authenticated user has upvoted this specific complaint - enabling accurate upvote toggle UI state.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        complaint: {
                            id: "c123",
                            title: "Pothole on Main St",
                            status: "open",
                            upvotes: 15,
                            userUpvoted: false,
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/api/complaints",
                description:
                    "Creates a new civic complaint. Must be sent as multipart/form-data to support photo attachments (max 4 photos). Required fields: title, categoryId, issueType, addressText, and photo files, latitude, longitude. Optional: description. Only users with the 'citizen' role can submit complaints. Rate-limited to prevent spam.",
                requiresAuth: true,
                requestBody: {
                    title: "Pothole on Main St",
                    description:
                        "Large pothole in the left lane causing hazard.",
                    categoryId: "cat-uuid",
                    issueType: "infrastructure",
                    addressText: "Main St, New York, NY",
                    latitude: 40.71,
                    longitude: -74.0,
                },
                responseBody: {
                    success: true,
                    data: {
                        complaint: {
                            id: "c123",
                            title: "Pothole on Main St",
                            status: "open",
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/api/complaints/:id/upvote",
                description:
                    "Casts an upvote on a specific complaint on behalf of the authenticated citizen. Upvotes signal community support and may influence complaint prioritization. A citizen can only upvote a given complaint once - attempting to upvote again returns an error. Rate-limited per user. Role: citizen.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { upvotes: 16 },
                },
            },
            {
                method: "DELETE",
                path: "/api/complaints/:id/upvote",
                description:
                    "Removes a previously cast upvote from a complaint. Allows users to 'undo' their upvote if they change their mind. If the user has not previously upvoted this complaint, an error is returned. Rate-limited alongside the POST upvote endpoint. Role: citizen.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { upvotes: 15 },
                },
            },
            {
                method: "POST",
                path: "/api/complaints/:id/verify",
                description:
                    "Casts a binary (true/false) resolution verification vote on a complaint that has been marked as resolved. This crowdsourced verification confirms whether a fix is actually visible on the ground. Requires the user to have a saved location (requiresUserLocation). vote: true means 'Yes, it looks fixed'; vote: false means 'No, still an issue'. An optional comment can be included. Rate-limited. Role: citizen.",
                requiresAuth: true,
                requestBody: {
                    vote: true,
                    comment: "Looks fixed to me, the pothole is filled.",
                },
                responseBody: {
                    success: true,
                    data: { message: "Vote recorded." },
                },
            },
        ],
    },
    {
        title: "Public Departments",
        id: "public-departments",
        description:
            "Public endpoints for browsing civic departments and their statistics. No authentication required.",
        endpoints: [
            {
                method: "GET",
                path: "/api/departments/stats",
                description:
                    "Returns aggregated, system-wide statistics across all active departments. Useful for a platform overview or landing page - shows total number of departments, overall complaint resolution rates, and similar headline metrics. No authentication or query params required.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        stats: {
                            totalDepartments: 12,
                            overallResolutionRate: 85.5,
                        },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/departments/categories",
                description:
                    "Lists all complaint categories that are linked to departments in the system. Each category belongs to a specific department and is used when citizens submit new complaints to correctly route them. Use this to populate category dropdowns in complaint submission forms.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        categories: [
                            {
                                id: "cat-uuid",
                                name: "Road Infrastructure",
                                departmentId: "d1",
                            },
                        ],
                    },
                },
            },
            {
                method: "GET",
                path: "/api/departments",
                description:
                    "Returns a full list of all currently active departments. Inactive/deactivated departments (managed by admins) are excluded from this public listing. Useful for building department directory pages or filtering complaints by department.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        departments: [
                            {
                                id: "d1",
                                name: "Roads & Transport",
                                category: "infrastructure",
                            },
                        ],
                    },
                },
            },
            {
                method: "GET",
                path: "/api/departments/:id",
                description:
                    "Returns detailed profile information for a single department by its UUID. Includes the department's name, category, description, and performance metrics. Useful for building dedicated department profile pages showing their work and accountability stats.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        department: { id: "d1", name: "Roads & Transport" },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/departments/:id/complaints",
                description:
                    "Returns the most recent complaints assigned to the specified department. Provides a public transparency window into what issues a department is currently handling. Useful for department profile pages to show recent activity without exposing internal management tools.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { complaints: [] },
                },
            },
        ],
    },
    {
        title: "Department Dashboard",
        id: "dept",
        description:
            "Private endpoints for official (department) users to manage their assigned complaints. All require the 'official' role and a linked departmentId.",
        endpoints: [
            {
                method: "GET",
                path: "/api/dept/dashboard",
                description:
                    "Returns an overview of complaint counts and key performance indicators for the logged-in department. Counts are broken down by current status tab (assigned, in_progress, pending_verification, resolved, reopened). Useful for building the department's main dashboard screen with status summary cards.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        stats: { assigned: 45, in_progress: 12, resolved: 89 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/dept/complaints",
                description:
                    "Returns a paginated list of complaints assigned to the department. Filter by workflow stage using the tab param. Valid tabs: assigned, in_progress, pending_verification, resolved, reopened. Defaults to 'assigned'. Also supports search (title text), page, and limit query params.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        complaints: [],
                        pagination: { page: 1, limit: 20, total: 45 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/dept/complaints/:id",
                description:
                    "Returns the complete detail view for a specific complaint that is assigned to the department. Includes all citizen-submitted data, photo attachments, location, upvote count, current status, and the full status transition history. Officials use this to understand the complaint before taking action on it.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        complaint: {
                            id: "c123",
                            title: "Pothole",
                            status: "assigned",
                        },
                    },
                },
            },
            {
                method: "PATCH",
                path: "/api/dept/complaints/:id/status",
                description:
                    "Advances a complaint through the workflow by setting a new status. toStatus is required and must be a valid next state in the workflow (e.g. 'in_progress' → 'resolved'). An optional note can be added to explain the action. This endpoint also accepts multipart/form-data to attach work-completion photos as evidence alongside the status change.",
                requiresAuth: true,
                requestBody: {
                    toStatus: "resolved",
                    note: "Pothole has been filled and resurfaced.",
                },
                responseBody: {
                    success: true,
                    data: {
                        transition: { from: "in_progress", to: "resolved" },
                    },
                },
            },
        ],
    },
    {
        title: "Admin",
        id: "admin",
        description:
            "Administrative endpoints for system-wide management. Requires the 'admin' role.",
        endpoints: [
            {
                method: "GET",
                path: "/api/admin/dashboard",
                description:
                    "Returns a bird's-eye view of the entire platform - total registered users, total complaints submitted, active departments, resolution rates, and other system health indicators. Designed for the admin's main overview screen to monitor platform activity at a glance.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        totalUsers: 1542,
                        totalComplaints: 840,
                        activeDepartments: 12,
                    },
                },
            },
            {
                method: "GET",
                path: "/api/admin/audit-logs",
                description:
                    "Retrieves a filtered, paginated audit trail of all significant system events (department creation, account changes, status updates, etc.). Useful for compliance and security monitoring. Supports: search (text), action (event type code), entityType, dateFrom, dateTo (ISO strings), page, limit.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        logs: [],
                        pagination: { page: 1, limit: 20, total: 0 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/admin/audit-logs/:id",
                description:
                    "Fetches the complete details of a single audit log entry by its UUID. Includes the full context of the action - the actor, the target entity, the timestamp, and any metadata captured at the time of the event. Useful for investigating specific incidents.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        log: {
                            id: "a1",
                            action: "DEPT_CREATE",
                            entityType: "department",
                            createdAt: "2026-01-15T11:00:00+05:30",
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/api/admin/departments",
                description:
                    "Creates a brand new department account in the system. The admin provides the department's name, a contact email (used for login), an operational category (e.g. 'utilities', 'infrastructure'), a short description, and an initial password. The created department can immediately log in and manage complaints assigned to their category.",
                requiresAuth: true,
                requestBody: {
                    name: "Water Supply Board",
                    email: "water@civikeye.gov",
                    category: "utilities",
                    description:
                        "Manages city water distribution and infrastructure.",
                    password: "SecurePass123",
                },
                responseBody: {
                    success: true,
                    data: {
                        department: { id: "d2", name: "Water Supply Board" },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/admin/departments",
                description:
                    "Lists all departments in the system - both active and inactive. Unlike the public /api/departments endpoint, this includes deactivated departments and additional management fields (isActive, email, complaint stats). Used to power the admin's department management table.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { departments: [] },
                },
            },
            {
                method: "PATCH",
                path: "/api/admin/departments/:id",
                description:
                    "Toggles the active/inactive status of a department. If the department is currently active, it becomes inactive (deactivated), and vice versa. No body is required - it's a pure toggle. Deactivated departments cannot log in and are hidden from the public listing, but their complaint data is preserved.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { department: { id: "d1", isActive: false } },
                },
            },
            {
                method: "PATCH",
                path: "/api/admin/departments/:id/password",
                description:
                    "Resets the login password for a specific department account. Used when a department has forgotten their credentials or when offboarding/onboarding department staff. The new password must meet the same strength requirements as registration. The admin does not need to know the current password.",
                requiresAuth: true,
                requestBody: { password: "NewSecurePass123" },
                responseBody: {
                    success: true,
                    data: {
                        message:
                            "Department password has been reset successfully.",
                    },
                },
            },
            {
                method: "POST",
                path: "/api/admin/sla-categories",
                description:
                    "Creates a new Service Level Agreement (SLA) category that defines the expected resolution time for a particular type of complaint. SLA categories are attached to complaint categories to enforce accountability - departments are measured against these resolution time targets.",
                requiresAuth: true,
                requestBody: { name: "Road Potholes", resolutionHours: 48 },
                responseBody: {
                    success: true,
                    data: { message: "SLA category created" },
                },
            },
            {
                method: "GET",
                path: "/api/admin/sla-categories",
                description:
                    "Retrieves all SLA categories with their configured resolution time targets. The admin uses this to review and manage the accountability framework that governs how quickly each type of civic issue is expected to be addressed by the relevant department.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { categories: [] },
                },
            },
            {
                method: "PATCH",
                path: "/api/admin/sla-categories/:id",
                description:
                    "Updates the resolution time target (resolutionHours) or name for an existing SLA category. Adjusting SLA targets affects how complaint resolution performance is measured going forward - existing resolved complaints are not retroactively re-evaluated.",
                requiresAuth: true,
                requestBody: { resolutionHours: 72 },
                responseBody: {
                    success: true,
                    data: { message: "SLA category updated" },
                },
            },
        ],
    },
    {
        title: "SLA Categories",
        id: "sla-categories",
        description: "Public endpoint for Service Level Agreement categories.",
        endpoints: [
            {
                method: "GET",
                path: "/api/sla-categories",
                description:
                    "Returns all publicly visible SLA categories and their resolution time targets. This can be used on public-facing pages to show citizens how quickly each type of issue is supposed to be resolved - for example, 'Potholes are expected to be fixed within 48 hours.' Useful for building transparency dashboards.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { categories: [] },
                },
            },
        ],
    },
    {
        title: "Volunteer",
        id: "volunteer",
        description:
            "Endpoints for citizen volunteers discovering and completing field verification tasks.",
        endpoints: [
            {
                method: "GET",
                path: "/api/volunteer/leaderboard",
                description:
                    "Returns a paginated, ranked leaderboard of the most active citizen volunteers sorted by civic points. Only users who have opted into leaderboard visibility (via preferences) are included. Query params: page, limit. This can be displayed publicly to motivate community participation.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        leaderboard: [
                            {
                                rank: 1,
                                displayName: "Amit Patel",
                                civicPoints: 1200,
                            },
                        ],
                        pagination: { page: 1, limit: 20, total: 50 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/volunteer/discover",
                description:
                    "Returns a list of open verification tasks available for the authenticated citizen to claim. Tasks are complaints that have been marked as resolved by a department and now need a field volunteer to confirm the fix on-site. Supports query params: search, page, limit.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        tasks: [],
                        pagination: { page: 1, limit: 20, total: 0 },
                    },
                },
            },
            {
                method: "GET",
                path: "/api/volunteer/my-tasks",
                description:
                    "Returns tasks that the authenticated citizen has claimed and is responsible for completing. Supports a tab query param to filter between active (claimed but not yet submitted) and completed tasks. Used to build the volunteer's personal task management view.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { tasks: [] },
                },
            },
            {
                method: "GET",
                path: "/api/volunteer/impact",
                description:
                    "Returns a summary of the authenticated user's volunteer contribution and impact. Includes total verifications performed, tasks completed, civic points earned, and their computed rank (e.g. Bronze, Silver, Gold). Used for building the personal impact/achievement page.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        verifications: 15,
                        tasksCompleted: 7,
                        civicPoints: 450,
                        rank: "Silver",
                    },
                },
            },
            {
                method: "POST",
                path: "/api/volunteer/tasks/:id/claim",
                description:
                    "Claims a specific verification task, reserving it for the authenticated citizen to complete. Once claimed, the task is locked so that other volunteers cannot claim the same one. Rate-limited to prevent users from mass-claiming tasks without completing them. Role: citizen.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { message: "Task claimed successfully." },
                },
            },
            {
                method: "POST",
                path: "/api/volunteer/tasks/:id/complete",
                description:
                    "Marks a claimed task as completed and submits proof of completion. Must be sent as multipart/form-data. The 'proof' field (a photo file) is required - this is the on-site evidence photo taken by the volunteer. An optional 'note' text field can be included to describe observations. Earning civic points depends on this submission being accepted.",
                requiresAuth: true,
                requestBody: {
                    note: "Fixed and verified on site. Road surface looks smooth.",
                    proof: "[file upload - multipart/form-data field named 'proof']",
                },
                responseBody: {
                    success: true,
                    data: { message: "Task completed." },
                },
            },
        ],
    },
    {
        title: "Notifications",
        id: "notifications",
        description: "Endpoints for managing authenticated user notifications.",
        endpoints: [
            {
                method: "GET",
                path: "/api/notifications/unread-count",
                description:
                    "Returns the count of unread notifications for the authenticated user. Designed to be polled lightly (or triggered on focus) to power a notification badge in the app's navigation header. Returns a single integer rather than the full list, making it very lightweight.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { unreadCount: 5 },
                },
            },
            {
                method: "PATCH",
                path: "/api/notifications/read-all",
                description:
                    "Marks every unread notification for the authenticated user as read in a single bulk operation. Typically triggered when the user opens the notification panel. Returns the number of notifications that were updated. Calling this when all notifications are already read is a no-op.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { updated: 5 },
                },
            },
            {
                method: "GET",
                path: "/api/notifications",
                description:
                    "Returns a paginated list of all notifications for the authenticated user, sorted newest-first. Each notification includes the type, a human-readable message, a link to the relevant entity (e.g. a complaint), read status, and timestamps. Supports query params: page, limit.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        notifications: [],
                        pagination: { page: 1, limit: 20, total: 0 },
                    },
                },
            },
            {
                method: "PATCH",
                path: "/api/notifications/:id/read",
                description:
                    "Marks a single specific notification as read by its UUID. Used when a user clicks on an individual notification item. Returns the updated notification object with a readAt timestamp. If the notification does not belong to the authenticated user, a 404 is returned.",
                requiresAuth: true,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: { id: "n1", readAt: "2026-01-15T11:00:00+05:30" },
                },
            },
        ],
    },
    {
        title: "Users",
        id: "users",
        description: "Public user profile endpoints.",
        endpoints: [
            {
                method: "GET",
                path: "/api/users/:id/profile",
                description:
                    "Retrieves the publicly visible profile for any user by their UUID. The amount of data returned is governed entirely by the target user's privacy preferences. If showNameOnComplaints is false, the displayName will be anonymized and isAnonymous will be true. If showContributionHistory is false, the contributionSummary will be null. The communityVerification field shows whether this user is a recognized field volunteer.",
                requiresAuth: false,
                requestBody: null,
                responseBody: {
                    success: true,
                    data: {
                        id: "u1",
                        displayName: "Amit Patel",
                        isAnonymous: false,
                        role: "citizen",
                        memberSince: "2026-01-01T00:00:00+05:30",
                        communityVerification: "verified",
                        contributionSummary: {
                            complaintsField: 10,
                            upvotesCast: 45,
                            verificationsCast: 8,
                            tasksCompleted: 3,
                            civicPoints: 750,
                        },
                    },
                },
            },
        ],
    },
];
