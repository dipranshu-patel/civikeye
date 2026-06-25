"use strict";

const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (!RESEND_API_KEY) {
    throw new Error(
        "[email.js] RESEND_API_KEY is not set in environment variables. " +
            "Add it to your .env file before starting the server.",
    );
}

if (!EMAIL_FROM) {
    throw new Error(
        "[email.js] EMAIL_FROM is not set in environment variables. " +
            "Set it to a Resend-verified sender address (e.g. noreply@civikeye.online).",
    );
}

const resend = new Resend(RESEND_API_KEY);

class EmailError extends Error {
    constructor(message, code, cause) {
        super(message);
        this.name = "EmailError";
        this.code = code;
        this.cause = cause ?? null;
    }
}

function buildOtpEmailHtml(otp, ttlMinutes) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your CivikEye Verification Code</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f4f6f8;padding:48px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%"
                    style="max-width:480px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">

                    <!-- Body -->
                    <tr>
                        <td style="padding:36px 40px 32px;">
                            <h2
                                style="margin:0 0 10px;color:#1a202c;font-size:17px;font-weight:600;letter-spacing:-0.2px;">
                                Verify your email address
                            </h2>
                            <p style="margin:0 0 30px;color:#718096;font-size:14px;line-height:1.65;">
                                Use the code below to complete your CivikEye account setup. Do not share this code with
                                anyone.
                            </p>

                            <!-- OTP box -->
                            <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;
                          padding:24px 20px;text-align:center;margin:0 0 30px;">
                                <p style="margin:0 0 10px;color:#a0aec0;font-size:11px;
                           letter-spacing:1.8px;text-transform:uppercase;font-weight:600;">
                                    Verification Code
                                </p>
                                <p style="margin:0;color:#2b6cb0;font-size:36px;font-weight:700;
                           letter-spacing:14px;font-variant-numeric:tabular-nums;">
                                    ${otp}
                                </p>
                                <p style="margin:12px 0 0;color:#a0aec0;font-size:12px;">
                                    Expires in <span style="color:#4a5568;font-weight:600;">${ttlMinutes} minutes</span>
                                </p>
                            </div>

                            <p style="margin:0;color:#718096;font-size:13px;line-height:1.65;">
                                If you did not request this code, you can safely ignore this email. Your account will
                                not be affected.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;
}

const OTP_EMAIL_TTL_MINUTES = 10;

async function sendOtpEmail(to, otp) {
    let response;

    try {
        response = await resend.emails.send({
            from: EMAIL_FROM,
            to: [to],
            subject: `${otp} is your CivikEye verification code`,
            html: buildOtpEmailHtml(otp, OTP_EMAIL_TTL_MINUTES),
        });
    } catch (sdkErr) {
        throw new EmailError(
            "Could not reach the email service. Please try again in a moment.",
            "EMAIL_NETWORK_ERROR",
            sdkErr,
        );
    }

    if (response.error) {
        const status = response.error.statusCode ?? 0;
        const message = response.error.message ?? "Unknown Resend error";

        if (status === 401 || status === 403) {
            throw new EmailError(
                "Email service authentication failed. Check your RESEND_API_KEY.",
                "EMAIL_API_KEY_INVALID",
                new Error(message),
            );
        }

        if (status === 422) {
            throw new EmailError(
                "Email sender domain is not verified. Check EMAIL_FROM and your Resend domain settings.",
                "EMAIL_DOMAIN_INVALID",
                new Error(message),
            );
        }

        throw new EmailError(
            `Email could not be sent: ${message}`,
            "EMAIL_SEND_FAILED",
            new Error(message),
        );
    }
}

const RESET_EMAIL_TTL_MINUTES = 15;

function buildPasswordResetEmailHtml(resetUrl, ttlMinutes) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your CivikEye Password</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f4f6f8;padding:48px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%"
                    style="max-width:480px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#1a365d;padding:28px 40px;text-align:center;">
                            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
                                CivikEye
                            </p>
                            <p style="margin:6px 0 0;color:#90cdf4;font-size:12px;letter-spacing:0.5px;">
                                SECURE ACCOUNT SERVICES
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:36px 40px 32px;">
                            <h2 style="margin:0 0 10px;color:#1a202c;font-size:17px;font-weight:600;letter-spacing:-0.2px;">
                                Reset your password
                            </h2>
                            <p style="margin:0 0 28px;color:#718096;font-size:14px;line-height:1.65;">
                                We received a request to reset the password for your CivikEye account.
                                Click the button below to choose a new password.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%"
                                style="margin:0 0 28px;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}"
                                            style="display:inline-block;background-color:#2b6cb0;color:#ffffff;
                                                   font-size:14px;font-weight:600;text-decoration:none;
                                                   border-radius:6px;padding:13px 32px;letter-spacing:0.2px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expiry notice -->
                            <p style="margin:0 0 20px;color:#718096;font-size:13px;line-height:1.65;">
                                This link expires in
                                <span style="color:#4a5568;font-weight:600;">${ttlMinutes} minutes</span>.
                                If it expires, please submit a new password reset request.
                            </p>

                            <!-- Ignore notice -->
                            <p style="margin:0 0 20px;color:#718096;font-size:13px;line-height:1.65;">
                                If you did not request a password reset, you can safely ignore this email.
                                Your password will remain unchanged.
                            </p>

                            <!-- Divider -->
                            <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />

                            <!-- Security warning -->
                            <p style="margin:0;color:#e53e3e;font-size:12px;line-height:1.65;">
                                <strong>Security notice:</strong> CivikEye will never ask for your password
                                by email or phone. If you did not make this request, please contact our
                                support team immediately.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8fafc;padding:18px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                            <p style="margin:0;color:#a0aec0;font-size:11px;">
                                &copy; ${new Date().getFullYear()} CivikEye. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;
}

async function sendPasswordResetEmail(to, resetUrl) {
    let response;

    try {
        response = await resend.emails.send({
            from: EMAIL_FROM,
            to: [to],
            subject: "Reset your CivikEye password",
            html: buildPasswordResetEmailHtml(resetUrl, RESET_EMAIL_TTL_MINUTES),
        });
    } catch (sdkErr) {
        throw new EmailError(
            "Could not reach the email service. Please try again in a moment.",
            "EMAIL_NETWORK_ERROR",
            sdkErr,
        );
    }

    if (response.error) {
        const status = response.error.statusCode ?? 0;
        const message = response.error.message ?? "Unknown Resend error";

        if (status === 401 || status === 403) {
            throw new EmailError(
                "Email service authentication failed. Check your RESEND_API_KEY.",
                "EMAIL_API_KEY_INVALID",
                new Error(message),
            );
        }

        if (status === 422) {
            throw new EmailError(
                "Email sender domain is not verified. Check EMAIL_FROM and your Resend domain settings.",
                "EMAIL_DOMAIN_INVALID",
                new Error(message),
            );
        }

        throw new EmailError(
            `Email could not be sent: ${message}`,
            "EMAIL_SEND_FAILED",
            new Error(message),
        );
    }
}

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail,
    EmailError,
    buildOtpEmailHtml,
    buildPasswordResetEmailHtml,
};
