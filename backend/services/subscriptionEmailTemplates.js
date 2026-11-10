// backend/services/subscriptionEmailTemplates.js   (NEW FILE)
//
// Vatup CRM styled layout for subscription emails (expiry reminder,
// plan expired, manual reminder). Same look as the CRM's password reset
// email: centered logo, heading, text, details box, green button,
// fallback link, sign-off.
//
// LOGO: lives inside the Super Admin project at
//   frontend/public/email-logo.png
// and is loaded from  <FRONTEND_URL>/email-logo.png  (the FRONTEND_URL
// that is already in backend/.env - no new setting needed).
// Make sure FRONTEND_URL is your live Super Admin address in production.

const BRAND_NAME = "Vatup CRM";
const BRAND_COLOR = "#16a34a";
const DEFAULT_CRM_URL = "https://crm.vatupcrm.in";
const FONT = "Arial,Helvetica,sans-serif";

const getCrmBaseUrl = () => {
  let url = (process.env.CRM_FRONTEND_URL || "").trim() || DEFAULT_CRM_URL;

  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  return url.replace(/\/+$/, "");
};

const getLogoUrl = () => {
  let url = (process.env.FRONTEND_URL || "").trim();

  if (!url) return `${getCrmBaseUrl()}/email-logo.png`;

  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  return `${url.replace(/\/+$/, "")}/email-logo.png`;
};

// Where the "Renew Plan" button goes. Change this one line to use a
// different address.
const RENEW_URL = "https://vatupcrm.in/";

const getRenewUrl = () => RENEW_URL;

// Escape database / user values before they go into the HTML
const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

const paragraph = (html) =>
  `<p style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:1.65;color:#222222;">${html}</p>`;

const smallText = (html) =>
  `<p style="margin:0 0 14px 0;font-family:${FONT};font-size:13px;line-height:1.65;color:#666666;">${html}</p>`;

const detailsBox = (rows) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin:18px 0;">
    <tr>
      <td style="padding:14px 18px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${rows
            .map(
              (row) => `
          <tr>
            <td width="130" style="width:130px;padding:5px 12px 5px 0;font-family:${FONT};font-size:15px;color:#555555;white-space:nowrap;vertical-align:top;">${esc(
                row.label
              )}</td>
            <td style="padding:5px 0;font-family:${FONT};font-size:15px;color:#111111;font-weight:bold;vertical-align:top;">${esc(
                row.value
              )}</td>
          </tr>`
            )
            .join("")}
        </table>
      </td>
    </tr>
  </table>`;

const button = (label, url) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px 0;">
    <tr>
      <td align="center" bgcolor="${BRAND_COLOR}" style="border-radius:6px;">
        <a href="${esc(url)}" target="_blank"
           style="display:inline-block;padding:12px 28px;font-family:${FONT};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">${esc(
    label
  )}</a>
      </td>
    </tr>
  </table>`;

const fallbackLink = (url) =>
  smallText(
    `Button not working? Copy this link into your browser:<br />
     <a href="${esc(url)}" style="color:${BRAND_COLOR};word-break:break-all;">${esc(
      url
    )}</a>`
  );

const layout = ({ preheader = "", title, bodyHtml }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(
    preheader
  )}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f5">
    <tr>
      <td align="center" style="padding:28px 12px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
          <tr>
            <td style="padding:32px 36px;">

              <!-- Logo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;border-bottom:1px solid #e5e7eb;">
                    <img src="${esc(getLogoUrl())}" alt="${esc(
  BRAND_NAME
)}" width="260"
                         style="display:block;width:260px;max-width:100%;height:auto;border:0;margin:0 auto;" />
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="margin:24px 0 16px 0;font-family:${FONT};font-size:20px;line-height:1.3;color:#111111;">${esc(
  title
)}</h1>

              ${bodyHtml}

              <!-- Sign-off -->
              <hr style="border:0;border-top:1px solid #e5e7eb;margin:10px 0 18px 0;" />
              <p style="margin:0 0 14px 0;font-family:${FONT};font-size:15px;line-height:1.65;color:#222222;">
                Regards,<br />${esc(BRAND_NAME)} Team
              </p>
              <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:#999999;">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

// ------------------------------------------------------------------
// "Your plan expires in N days"
// ------------------------------------------------------------------
const buildExpiryReminderEmail = ({
  ownerName,
  companyName,
  planName,
  expiryDate,
  daysRemaining,
}) => {
  const renewUrl = getRenewUrl();

  const bodyHtml = `
    ${paragraph(`Hello ${esc(ownerName || "there")},`)}
    ${paragraph(
      `Your <strong>${esc(planName)}</strong> subscription for <strong>${esc(
        companyName
      )}</strong> will expire in <strong>${esc(daysRemaining)} days</strong>.`
    )}
    ${detailsBox([
      { label: "Company", value: companyName },
      { label: "Plan", value: planName },
      { label: "Expiry Date", value: formatDate(expiryDate) },
      { label: "Days Left", value: `${daysRemaining} days` },
    ])}
    ${paragraph(
      "Please renew your subscription before the expiry date to continue using all CRM features without interruption."
    )}
    ${button("Renew Plan", renewUrl)}
    ${smallText(
      "If you have already renewed your subscription, you can ignore this email."
    )}
    ${fallbackLink(renewUrl)}`;

  return layout({
    preheader: `Your ${planName} subscription expires in ${daysRemaining} days.`,
    title: "Subscription Expiry Reminder",
    bodyHtml,
  });
};

// ------------------------------------------------------------------
// "Your plan has expired"
// ------------------------------------------------------------------
const buildPlanExpiredEmail = ({
  ownerName,
  companyName,
  planName,
  expiryDate,
}) => {
  const renewUrl = getRenewUrl();

  const bodyHtml = `
    ${paragraph(`Hello ${esc(ownerName || "there")},`)}
    ${paragraph(
      `Your <strong>${esc(planName)}</strong> subscription for <strong>${esc(
        companyName
      )}</strong> has expired.`
    )}
    ${detailsBox([
      { label: "Company", value: companyName },
      { label: "Plan", value: planName },
      { label: "Expired On", value: formatDate(expiryDate) },
    ])}
    ${paragraph(
      "Your account access is limited until the subscription is renewed. Renew now to get back to all CRM features."
    )}
    ${button("Renew Plan", renewUrl)}
    ${fallbackLink(renewUrl)}`;

  return layout({
    preheader: `Your ${planName} subscription has expired. Renew to continue.`,
    title: "Your Subscription Has Expired",
    bodyHtml,
  });
};

// ------------------------------------------------------------------
// Manual reminder typed by the Super Admin (content is already HTML
// paragraphs from the reminder popup)
// ------------------------------------------------------------------
const buildManualReminderEmail = ({ subject, contentHtml }) => {
  const renewUrl = getRenewUrl();

  const bodyHtml = `
    <div style="font-family:${FONT};font-size:15px;line-height:1.65;color:#222222;margin:0 0 14px 0;">
      ${contentHtml}
    </div>
    ${button("Renew Plan", renewUrl)}
    ${fallbackLink(renewUrl)}`;

  return layout({
    preheader: subject,
    title: "Subscription Reminder",
    bodyHtml,
  });
};

module.exports = {
  buildExpiryReminderEmail,
  buildPlanExpiredEmail,
  buildManualReminderEmail,
};