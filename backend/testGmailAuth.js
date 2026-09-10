require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.MAIL_USER.trim(),
    pass: process.env.MAIL_PASSWORD.replace(/\s/g, ""),
  },

  tls: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    await transporter.verify();

    console.log("=================================");
    console.log("GMAIL SMTP LOGIN SUCCESS");
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("GMAIL SMTP LOGIN FAILED");
    console.error(error);
    console.error("=================================");
  }
}

test();