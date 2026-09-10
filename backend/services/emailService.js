const { sendEmailWithNodemailer } = require("./nodemailerService");
const { sendEmail: sendEmailWithBrevo } = require("./brevoService");

const sendEmail = async ({ to, subject, htmlContent }) => {
  // ==========================================
  // 1. PRIMARY PROVIDER - NODEMAILER
  // ==========================================
  try {
    console.log("=================================");
    console.log("Trying email provider: Nodemailer");
    console.log("=================================");

    const result = await sendEmailWithNodemailer({
      to,
      subject,
      htmlContent,
    });

    if (result?.success) {
      console.log("Email sent successfully using Nodemailer");

      return {
        success: true,
        provider: "nodemailer",
        response: result.response,
      };
    }

    throw new Error("Nodemailer returned unsuccessful response");
  } catch (nodemailerError) {
    console.error(
      "Nodemailer failed:",
      nodemailerError.message
    );

    console.log("Falling back to Brevo...");
  }

  // ==========================================
  // 2. FALLBACK PROVIDER - BREVO
  // ==========================================
  try {
    console.log("=================================");
    console.log("Trying email provider: Brevo");
    console.log("=================================");

    const result = await sendEmailWithBrevo({
      to,
      subject,
      htmlContent,
    });

    if (result?.success) {
      console.log("Email sent successfully using Brevo");

      return {
        success: true,
        provider: "brevo",
        response: result.response,
      };
    }

    throw new Error("Brevo returned unsuccessful response");
  } catch (brevoError) {
    console.error(
      "Brevo failed:",
      brevoError.body || brevoError.message
    );

    return {
      success: false,
      provider: null,
      error: brevoError.body || brevoError.message,
    };
  }
};

module.exports = {
  sendEmail,
};