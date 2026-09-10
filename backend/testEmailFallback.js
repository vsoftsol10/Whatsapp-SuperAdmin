require("dotenv").config();

const { sendEmail } = require("./services/emailService");

async function testEmail() {
  try {
    const result = await sendEmail({
      to: process.env.MAIL_USER,
      subject: "WhatsApp CRM - Email Fallback Test",
      htmlContent: `
        <h2>Email Service Test</h2>
        <p>This email was sent through the WhatsApp CRM email service.</p>
        <p>The system uses Nodemailer as the primary provider and Brevo as the fallback provider.</p>
      `,
    });

    console.log("=================================");
    console.log("EMAIL TEST COMPLETED");
    console.log("Success:", result.success);
    console.log("Provider:", result.provider);
    console.log("=================================");
  } catch (error) {
    console.error("EMAIL TEST FAILED");
    console.error(error);
  }
}

testEmail();