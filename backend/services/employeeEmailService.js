

// const { sendEmail } = require("./brevoService");

// const sendEmployeeCredentialsEmail = async ({
//   employeeName,
//   employeeEmail,
//   employeeId,
//   password
// }) => {

//   const loginUrl =
//     `${process.env.FRONTEND_URL || "https://whatsapp-superadmin.onrender.com"}/login`;

//   const htmlContent = `

//   <div style="font-family:Arial,sans-serif">

//     <h2 style="color:#111827;">
//       Welcome ${employeeName}
//     </h2>


//     <p style="color:#4b5563;line-height:1.6;">
//       Your employee account has been successfully created.
//     </p>

//     <div style="
//   margin:25px 0;
//   text-align:center;
// ">
//   <a
//     href="${loginUrl}"
//     style="
//       display:inline-block;
//       padding:12px 24px;
//       background:#111827;
//       color:white;
//       text-decoration:none;
//       border-radius:8px;
//       font-weight:600;
//     "
//   >
//     Login 
//   </a>
// </div>

// <p style="
//   color:#6b7280;
//   font-size:13px;
//   word-break:break-all;
// ">
//   Login URL: ${loginUrl}
// </p>


//     <div style="
//       margin:25px 0;
//       padding:20px;
//       background:#f9fafb;
//       border-radius:10px;
//     ">


//       <p style="margin:8px 0;">
//         <strong>Employee ID:</strong> ${employeeId}
//       </p>


//       <p style="margin:8px 0;">
//         <strong>Login Email:</strong> ${employeeEmail}
//       </p>


//       <p style="margin:8px 0;">
//         <strong>Temporary Password:</strong> ${password}
//       </p>


//     </div>


//     <p style="color:#4b5563;line-height:1.6;">
//       You can login using your email address and temporary password.
//     </p>


//     <p style="
//       color:#dc2626;
//       font-weight:600;
//     ">
//       Please change your password after your first login.
//     </p>


//     <p style="
//       color:#6b7280;
//       margin-top:25px;
//     ">
//       Thank you.
//     </p>


//   </div>

//   `;


//   return await sendEmail({

//     to: employeeEmail,

//     subject:
//       "Your Employee Account Login Credentials",

//     htmlContent

//   });

// };


// module.exports = {

//   sendEmployeeCredentialsEmail

// };


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
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Employee Account</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <!-- Main Wrapper -->

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color:#f3f4f6;
      margin:0;
      padding:40px 15px;
    "
  >

    <tr>

      <td align="center">

        <!-- Email Container -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:600px;
            background-color:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #e5e7eb;
          "
        >

          <!-- Header -->

          <tr>

            <td
              style="
                padding:30px 35px 20px 35px;
                text-align:center;
                border-bottom:1px solid #f0f0f0;
              "
            >

              <h1
                style="
                  margin:0;
                  font-size:24px;
                  line-height:32px;
                  color:#111827;
                  font-weight:700;
                "
              >
                Welcome ${employeeName}
              </h1>

              <p
                style="
                  margin:10px 0 0 0;
                  font-size:15px;
                  line-height:24px;
                  color:#6b7280;
                "
              >
                Your employee account has been successfully created.
              </p>

            </td>

          </tr>


          <!-- Content -->

          <tr>

            <td
              style="
                padding:30px 35px;
              "
            >

              <!-- Login Information -->

              <p
                style="
                  margin:0 0 20px 0;
                  font-size:15px;
                  line-height:24px;
                  color:#4b5563;
                "
              >
                You can access your WhatsApp CRM account using the
                login button below.
              </p>


              <!-- Login Button -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin:0 0 15px 0;
                "
              >

                <tr>

                  <td
                    align="center"
                    style="
                      padding:5px 0 10px 0;
                    "
                  >

                    <a
                      href="${loginUrl}"
                      target="_blank"
                      style="
                        display:inline-block;
                        padding:13px 30px;
                        background-color:#111827;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:8px;
                        font-size:15px;
                        font-weight:600;
                        line-height:20px;
                      "
                    >
                      Login to WhatsApp CRM
                    </a>

                  </td>

                </tr>

              </table>


              <!-- Login URL -->

              <p
                style="
                  margin:0 0 28px 0;
                  text-align:center;
                  font-size:12px;
                  line-height:20px;
                  color:#6b7280;
                  word-break:break-all;
                "
              >
                ${loginUrl}
              </p>


              <!-- Credentials Box -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color:#f9fafb;
                  border:1px solid #e5e7eb;
                  border-radius:10px;
                "
              >

                <!-- Employee ID -->

                <tr>

                  <td
                    style="
                      padding:15px 20px;
                      border-bottom:1px solid #e5e7eb;
                    "
                  >

                    <p
                      style="
                        margin:0 0 5px 0;
                        font-size:12px;
                        color:#6b7280;
                      "
                    >
                      Employee ID
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:22px;
                        color:#111827;
                        font-weight:600;
                      "
                    >
                      ${employeeId}
                    </p>

                  </td>

                </tr>


                <!-- Email -->

                <tr>

                  <td
                    style="
                      padding:15px 20px;
                      border-bottom:1px solid #e5e7eb;
                    "
                  >

                    <p
                      style="
                        margin:0 0 5px 0;
                        font-size:12px;
                        color:#6b7280;
                      "
                    >
                      Login Email
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:22px;
                        color:#111827;
                        font-weight:600;
                        word-break:break-all;
                      "
                    >
                      ${employeeEmail}
                    </p>

                  </td>

                </tr>


                <!-- Password -->

                <tr>

                  <td
                    style="
                      padding:15px 20px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 5px 0;
                        font-size:12px;
                        color:#6b7280;
                      "
                    >
                      Temporary Password
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:22px;
                        color:#111827;
                        font-weight:600;
                        letter-spacing:0.5px;
                      "
                    >
                      ${password}
                    </p>

                  </td>

                </tr>

              </table>


              <!-- First Login Notice -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:25px;
                  background-color:#fff7ed;
                  border:1px solid #fed7aa;
                  border-radius:8px;
                "
              >

                <tr>

                  <td
                    style="
                      padding:15px 18px;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        font-size:13px;
                        line-height:21px;
                        color:#c2410c;
                        font-weight:600;
                      "
                    >
                      Please change your password after your first login.
                    </p>

                  </td>

                </tr>

              </table>


              <!-- Closing -->

              <p
                style="
                  margin:28px 0 0 0;
                  font-size:14px;
                  line-height:22px;
                  color:#6b7280;
                "
              >
                Thank you.
              </p>

            </td>

          </tr>


          <!-- Footer -->

          <tr>

            <td
              style="
                padding:20px 35px;
                background-color:#f9fafb;
                border-top:1px solid #e5e7eb;
                text-align:center;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:12px;
                  line-height:20px;
                  color:#9ca3af;
                "
              >
                WhatsApp CRM Team
              </p>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
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