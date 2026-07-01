import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

const APP_NAME = "ShopMaster"

export async function sendPasswordResetEmail({
  email,
  fullname,
  resetLink,
}) {
  try {
    const payload = {
      sender: {
        name: `${APP_NAME} Security`,
        email: process.env.EMAIL, // must be domain-based sender
      },
      to: [{ email, name: fullname || "User" }],
      subject: `Password Reset Request – ${APP_NAME}`,

      // ✅ Minimal Transactional HTML
      htmlContent: `
<div style="font-family: Arial, sans-serif; font-size:14px; color:#000; line-height:1.6;">
  <p>Hello ${fullname || "User"},</p>

  <p>
    A request was received to reset your account password.
  </p>

  <p>
    To reset your password, use the secure link below.
    This link will expire in 5 minutes.
  </p>

  <p>
    ${resetLink}
  </p>

  <p>
    Requested On: ${new Date().toUTCString()}
  </p>

  <p>
    If you did not request a password reset, you may ignore this email.
    Your password will remain unchanged.
  </p>

  <hr/>

  <p style="font-size:12px; color:#555;">
    This is an automated security message regarding your account.
    Please do not reply to this email.
  </p>
</div>
      `,

      // ✅ Plain Text Version (Critical for Deliverability)
      textContent: `
Hello ${fullname || "User"},

A request was received to reset your account password.

Use the secure link below to reset your password.
This link will expire in 5 minutes.

${resetLink}

Requested On: ${new Date().toUTCString()}

If you did not request this, you may ignore this email.
Your password will remain unchanged.

This is an automated security message.
      `,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log(
      `${APP_NAME} PASSWORD RESET EMAIL SENT:`,
      response.data.messageId
    )
    return response.data
  } catch (error) {
    console.error(
      `${APP_NAME} Password reset email failed:`,
      error.response?.data || error.message
    )
    throw error
  }
}