const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true",

  auth: {
    user: process.env.MAIL_USER.trim(),
    pass: process.env.MAIL_PASSWORD.replace(/\s/g, ""),
  },

  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmailWithNodemailer = async ({
  to,
  subject,
  htmlContent,
}) => {
  const response = await transporter.sendMail({
    from: {
      name: process.env.MAIL_FROM_NAME,
      address: process.env.MAIL_FROM_EMAIL,
    },
    to,
    subject,
    html: htmlContent,
  });

  console.log(
    "Nodemailer email sent successfully:",
    response.messageId
  );

  return {
    success: true,
    provider: "nodemailer",
    response,
  };
};

module.exports = {
  sendEmailWithNodemailer,
};