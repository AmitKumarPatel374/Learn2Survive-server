import axios from "axios"

const BREVO_URL = "https://api.brevo.com/v3/smtp/email"
const BREVO_API_KEY = process.env.BREVO_API_KEY

const APP_NAME = "ShopMaster"

export async function sendPasswordUpdatedEmail({ email, name }) {
  try {
    const payload = {
      sender: {
        name: `${APP_NAME} Security`,
        email: process.env.EMAIL, // must be domain-based sender
      },
      to: [{ email, name: name || "User" }],
      subject: `Password Updated – ${APP_NAME}`,

      // ✅ Minimal Security Notification HTML
      htmlContent: `
<div style="font-family: Arial, sans-serif; font-size:14px; color:#000; line-height:1.6;">
  <p>Hello ${name || "User"},</p>

  <p>
    This is a confirmation that your account password has been successfully updated.
  </p>

  <p>
    Updated On: ${new Date().toUTCString()}
  </p>

  <p>
    If you did not make this change, please reset your password immediately
    and contact support.
  </p>

  <p>
    For security reasons, never share your password or verification codes.
    ${APP_NAME} staff will never ask for your password.
  </p>

  <hr/>

  <p style="font-size:12px; color:#555;">
    This is an automated security notification regarding your account.
    Please do not reply to this email.
  </p>
</div>
      `,

      // ✅ Plain Text Version (Critical for Deliverability)
      textContent: `
Hello ${name || "User"},

This confirms that your account password has been successfully updated.

Updated On: ${new Date().toUTCString()}

If you did not make this change, reset your password immediately and contact support.

Never share your password or verification codes.

This is an automated security notification.
      `,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log(
      `${APP_NAME} PASSWORD UPDATED EMAIL SENT:`,
      response.data.messageId
    )
    return response.data
  } catch (error) {
    console.error(
      `${APP_NAME} Password updated email failed:`,
      error.response?.data || error.message
    )
    throw error
  }
}