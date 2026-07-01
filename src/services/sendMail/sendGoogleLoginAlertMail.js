import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

const APP_NAME = "ShopMaster"
const FRONTEND_URL = process.env.CLIENT_ORIGIN
const LOGO_URL = "https://ik.imagekit.io/amit374/n23/myLogo.png?updatedAt=1762869433221"

export async function sendGoogleLoginAlertMail({ email, name }) {
  try {
    const payload = {
      sender: {
        name: APP_NAME,
        email: process.env.EMAIL,
      },
      to: [{ email, name }],
      subject: `🔐 New Google Login Alert | ${APP_NAME}`,
      htmlContent: `
<div style="font-family: Arial, sans-serif; font-size:14px; color:#000; line-height:1.6;">
  <p>Hello ${name},</p>

  <p>
    A new sign-in to your ${APP_NAME} account was detected using Google.
  </p>

  <p>
    <strong>Login Method:</strong> Google OAuth<br/>
    <strong>Date & Time:</strong> ${new Date().toUTCString()}
  </p>

  <p>
    If this was you, no further action is required.
  </p>

  <p>
    If you did not perform this login, please secure your account immediately by changing your password.
  </p>

  <p>
    You can review your account here:<br/>
    ${FRONTEND_URL}/user-profile
  </p>

  <hr/>

  <p style="font-size:12px; color:#555;">
    This is an automated security notification. Please do not reply.
  </p>
</div>
`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log(`${APP_NAME} GOOGLE LOGIN EMAIL SENT:`, response.data.messageId)
    return response.data
  } catch (error) {
    console.error(`${APP_NAME} Google login email failed:`, error.response?.data || error.message)
    throw error
  }
}
