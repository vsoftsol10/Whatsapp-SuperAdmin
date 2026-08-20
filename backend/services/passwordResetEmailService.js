const { sendEmail } = require("./brevoService");

const sendSuperAdminPasswordResetEmail = async ({
  adminName,
  adminEmail,
  resetLink,
}) => {

  const htmlContent = `

    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      background: #ffffff;
    ">

      <h2 style="
        color: #111827;
        margin-bottom: 10px;
      ">
        Reset Your Password
      </h2>

      <p style="
        color: #4b5563;
        line-height: 1.6;
      ">
        Hello ${adminName},
      </p>

      <p style="
        color: #4b5563;
        line-height: 1.6;
      ">
        We received a request to reset the password for your
        Super Admin account.
      </p>

      <div style="
        margin: 30px 0;
        text-align: center;
      ">

        <a
          href="${resetLink}"
          style="
            display: inline-block;
            padding: 13px 25px;
            background: #25D366;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          "
        >
          Reset Password
        </a>

      </div>

      <p style="
        color: #6b7280;
        line-height: 1.6;
      ">
        This password reset link will expire in
        <strong>15 minutes</strong>.
      </p>

      <p style="
        color: #6b7280;
        line-height: 1.6;
      ">
        If you did not request a password reset, you can safely
        ignore this email.
      </p>

      <p style="
        color: #6b7280;
        margin-top: 30px;
      ">
        Thank you.
      </p>

    </div>

  `;

  return await sendEmail({
    to: adminEmail,
    subject: "Reset Your Super Admin Password",
    htmlContent,
  });
};

module.exports = {
  sendSuperAdminPasswordResetEmail,
};