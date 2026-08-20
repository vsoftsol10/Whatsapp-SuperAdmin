
require("dotenv").config();

const { sendEmail } = require("./services/brevoService");

const testEmail = async () => {
  try {
    await sendEmail({
      to: "malarselvi273@gmail.com",
      subject: "Brevo Test Email",
      htmlContent: `
        <h2>Brevo Test</h2>
        <p>This email was sent successfully using Brevo.</p>
      `
    });

    console.log("Test email completed");
  } catch (error) {
    console.error("Test email failed");
  }
};

testEmail();

