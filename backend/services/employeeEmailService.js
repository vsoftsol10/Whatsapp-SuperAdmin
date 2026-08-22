

const { sendEmail } = require("./brevoService");

const sendEmployeeCredentialsEmail = async ({
  employeeName,
  employeeEmail,
  employeeId,
  password
}) => {

  const loginUrl =
    `${process.env.FRONTEND_URL || "https://whatsapp-superadmin.onrender.com"}/login`;

  const htmlContent = `

  <div style="font-family:Arial,sans-serif">

    <h2 style="color:#111827;">
      Welcome ${employeeName}
    </h2>


    <p style="color:#4b5563;line-height:1.6;">
      Your employee account has been successfully created.
    </p>

    <div style="
  margin:25px 0;
  text-align:center;
">
  <a
    href="${loginUrl}"
    style="
      display:inline-block;
      padding:12px 24px;
      background:#111827;
      color:white;
      text-decoration:none;
      border-radius:8px;
      font-weight:600;
    "
  >
    Login 
  </a>
</div>

<p style="
  color:#6b7280;
  font-size:13px;
  word-break:break-all;
">
  Login URL: ${loginUrl}
</p>


    <div style="
      margin:25px 0;
      padding:20px;
      background:#f9fafb;
      border-radius:10px;
    ">


      <p style="margin:8px 0;">
        <strong>Employee ID:</strong> ${employeeId}
      </p>


      <p style="margin:8px 0;">
        <strong>Login Email:</strong> ${employeeEmail}
      </p>


      <p style="margin:8px 0;">
        <strong>Temporary Password:</strong> ${password}
      </p>


    </div>


    <p style="color:#4b5563;line-height:1.6;">
      You can login using your email address and temporary password.
    </p>


    <p style="
      color:#dc2626;
      font-weight:600;
    ">
      Please change your password after your first login.
    </p>


    <p style="
      color:#6b7280;
      margin-top:25px;
    ">
      Thank you.
    </p>


  </div>

  `;


  return await sendEmail({

    to: employeeEmail,

    subject:
      "Your Employee Account Login Credentials",

    htmlContent

  });

};


module.exports = {

  sendEmployeeCredentialsEmail

};