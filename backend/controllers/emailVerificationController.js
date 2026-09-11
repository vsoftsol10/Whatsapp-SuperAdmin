const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");

// Temporary OTP storage
// Later, for production, we can move this to PostgreSQL/Redis.
const otpStore = new Map();

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// ==========================================
// SEND OTP
// ==========================================
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otp = generateOTP();

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(normalizedEmail, {
      otp,
      expiresAt,
      attempts: 0,
    });

    const htmlContent = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
      ">

        <h2 style="color: #25D366;">
          Verify Your Email
        </h2>

        <p>
          Thank you for choosing WhatsApp CRM.
        </p>

        <p>
          Please use the following OTP to verify your email address:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          background: #f5f5f5;
          border-radius: 8px;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request this verification, you can safely
          ignore this email.
        </p>

        <p>
          Regards,<br />
          WhatsApp CRM Team
        </p>

      </div>
    `;

    // IMPORTANT:
    // This uses your existing Nodemailer → Brevo fallback service
    const result = await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your Email - WhatsApp CRM",
      htmlContent,
    });

    if (!result.success) {
      // If both Nodemailer and Brevo fail,
      // remove the OTP because email was not sent.
      otpStore.delete(normalizedEmail);

      return res.status(500).json({
        success: false,
        message: "Unable to send OTP. Please try again.",
      });
    }

    console.log(
      `OTP sent successfully to ${normalizedEmail} using ${result.provider}`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }
};


// ==========================================
// VERIFY OTP
// ==========================================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const enteredOTP = otp.trim();

    const storedData = otpStore.get(normalizedEmail);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(normalizedEmail);

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check OTP
    if (storedData.otp !== enteredOTP) {
      storedData.attempts += 1;

      // Maximum 5 attempts
      if (storedData.attempts >= 5) {
        otpStore.delete(normalizedEmail);

        return res.status(400).json({
          success: false,
          message:
            "Too many incorrect attempts. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // OTP correct
    otpStore.delete(normalizedEmail);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
};


module.exports = {
  sendOTP,
  verifyOTP,
};