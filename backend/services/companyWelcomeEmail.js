// const { sendEmail } = require("./emailService"); // <-- adjust path if needed

// const sendCompanyWelcomeEmail = async ({
//   companyName,
//   ownerName,
//   email,
//   password,
// }) => {
//   await sendEmail({
//     to: email,
//     subject: "Welcome to WhatsApp CRM",
//     htmlContent: `
//       <div style="font-family:Arial,sans-serif">
//         <h2>Welcome to WhatsApp CRM 🎉</h2>

//         <p>Hello <b>${ownerName}</b>,</p>

//         <p>Your company <b>${companyName}</b> has been created successfully.</p>

//         <h3>Login Credentials</h3>

//         <table cellpadding="8" style="border-collapse:collapse">
//           <tr>
//             <td><b>Email</b></td>
//             <td>${email}</td>
//           </tr>

//           <tr>
//             <td><b>Temporary Password</b></td>
//             <td>${password}</td>
//           </tr>

//           <tr>
//             <td><b>Login URL</b></td>
//             <td>
//               <a href="${process.env.CRM_FRONTEND_URL}/login">
//                  ${process.env.CRM_FRONTEND_URL}/login
//               </a>
//             </td>
//           </tr>
//         </table>

//         <br>

//         <p>Please change your password after your first login.</p>

//         <p>Regards,<br><b>WhatsApp CRM Team</b></p>
//       </div>
//     `,
//   });
// };

// module.exports = sendCompanyWelcomeEmail;


const { sendEmail } = require("./emailService");

const sendCompanyWelcomeEmail = async ({
  companyName,
  ownerName,
  email,
  password,
}) => {
  console.log("========================================");
  console.log("📧 COMPANY WELCOME EMAIL");
  console.log("To:", email);
  console.log("Company:", companyName);
  console.log("Owner:", ownerName);
  console.log("========================================");

  const result = await sendEmail({
    to: email,
    subject: "Welcome to WhatsApp CRM",
    htmlContent: `
      <div style="font-family:Arial,sans-serif">
        <h2>Welcome to WhatsApp CRM 🎉</h2>

        <p>Hello <b>${ownerName}</b>,</p>

        <p>
          Your company <b>${companyName}</b> has been created successfully.
        </p>

        <h3>Login Credentials</h3>

        <table cellpadding="8" style="border-collapse:collapse">
          <tr>
            <td><b>Email</b></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><b>Temporary Password</b></td>
            <td>${password}</td>
          </tr>

          <tr>
            <td><b>Login URL</b></td>
            <td>
              <a href="${process.env.CRM_FRONTEND_URL}/login">
                ${process.env.CRM_FRONTEND_URL}/login
              </a>
            </td>
          </tr>
        </table>

        <br>

        <p>
          Please change your password after your first login.
        </p>

        <p>
          Regards,<br>
          <b>WhatsApp CRM Team</b>
        </p>
      </div>
    `,
  });

  console.log("========================================");
  console.log("📧 COMPANY WELCOME EMAIL RESULT");
  console.log(result);
  console.log("========================================");

  if (!result?.success) {
    throw new Error(
      result?.error || "Company welcome email could not be sent"
    );
  }

  return result;
};

module.exports = sendCompanyWelcomeEmail;

