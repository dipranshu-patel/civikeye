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
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
         style="background-color:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background-color:#1e293b;
               border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%);
                       padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;
                         letter-spacing:-0.3px;">
                🏛 CivikEye
              </h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;font-weight:400;">
                Civic Issue Reporting Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 8px;color:#f1f5f9;font-size:18px;font-weight:600;">
                Verify your email address
              </h2>
              <p style="margin:0 0 28px;color:#94a3b8;font-size:14px;line-height:1.6;">
                Use the code below to verify your email address and complete your
                CivikEye account setup.
              </p>

              <!-- OTP box -->
              <div style="background-color:#0f172a;border:1px solid #334155;
                          border-radius:10px;padding:24px;text-align:center;margin:0 0 28px;">
                <p style="margin:0 0 8px;color:#64748b;font-size:12px;
                           letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">
                  Verification Code
                </p>
                <p style="margin:0;color:#60a5fa;font-size:40px;font-weight:800;
                           letter-spacing:12px;font-variant-numeric:tabular-nums;">
                  ${otp}
                </p>
                <p style="margin:12px 0 0;color:#64748b;font-size:12px;">
                  Valid for <strong style="color:#94a3b8;">${ttlMinutes} minutes</strong>
                </p>
              </div>

              <p style="margin:0 0 24px;color:#94a3b8;font-size:13px;line-height:1.6;">
                Enter this code on the CivikEye website to verify your email. If you
                did not request this code, you can safely ignore this email.
              </p>

              <!-- Security notice -->
              <div style="background-color:#1a0a00;border:1px solid #92400e;
                          border-radius:8px;padding:14px 18px;">
                <p style="margin:0;color:#fbbf24;font-size:12px;line-height:1.6;">
                  <strong>⚠ Security notice:</strong> CivikEye will never ask you to
                  share this code over the phone, chat, or email. If someone is asking
                  for it, it is a scam.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#475569;font-size:11px;line-height:1.6;text-align:center;">
                This email was sent by CivikEye — the civic issue reporting platform.<br/>
                If you have questions, contact support at
                <a href="mailto:support@civikeye.online"
                   style="color:#60a5fa;text-decoration:none;">support@civikeye.online</a>.
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

module.exports = {
    sendOtpEmail,
    EmailError,
    buildOtpEmailHtml,
};
