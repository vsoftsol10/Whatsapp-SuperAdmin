
const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY
});

const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [
        {
          email: to
        }
      ],
      subject,
      htmlContent
    });

    console.log("Brevo email sent successfully:", response);

    return {
      success: true,
      response
    };
  } catch (error) {
    console.error(
      "Brevo email failed:",
      error.body || error.message
    );

    throw error;
  }
};

module.exports = {
  sendEmail
};

