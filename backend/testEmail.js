require("dotenv").config();

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log(
    "MAIL_PASSWORD length:",
    process.env.MAIL_PASSWORD
        ? process.env.MAIL_PASSWORD.length
        : "NOT FOUND"
);
console.log(
  "MAIL_PASSWORD JSON:",
  JSON.stringify(process.env.MAIL_PASSWORD)
);

console.log(
  "MAIL_PASSWORD length:",
  process.env.MAIL_PASSWORD?.length
);

const {
    sendEmailWithNodemailer,
} = require("./services/nodemailerService");

const testEmail = async () => {
    try {
        const result = await sendEmailWithNodemailer({
            to: process.env.MAIL_USER,
            subject: "Nodemailer Test - WhatsApp CRM",
            htmlContent: `
        <h2>Nodemailer Test Successful</h2>
        <p>This email was sent using Gmail SMTP and Nodemailer.</p>
      `,
        });

        console.log("=================================");
        console.log("TEST EMAIL SENT SUCCESSFULLY");
        console.log("Provider:", result.provider);
        console.log("=================================");

    } catch (error) {
        console.error("=================================");
        console.error("TEST EMAIL FAILED");
        console.error(error);
        console.error("=================================");
    }
};

testEmail();