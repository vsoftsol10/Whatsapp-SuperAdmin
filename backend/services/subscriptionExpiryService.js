


const prisma = require("../config/prisma");
const { sendEmail } = require("../services/brevoService");

const updateExpiredSubscriptions = async () => {
  try {
    console.log("========================================");
    console.log("Checking subscription expiry and reminders...");
    console.log("========================================");

    const now = new Date();

    console.log("Current server time:", now);

    const subscriptions = await prisma.subscription.findMany({
      include: {
        company: true,
        plan: true,
        reminders: true
      },
      orderBy: {
        expiryDate: "asc"
      }
    });

    console.log("Total subscriptions:", subscriptions.length);

    if (subscriptions.length === 0) {
      console.log("No subscriptions found.");
      return;
    }

    // ==========================================
    // PROCESS EACH SUBSCRIPTION
    // ==========================================

    for (const subscription of subscriptions) {

      console.log("----------------------------------------");
      console.log("Subscription ID:", subscription.id);
      console.log(
        "Company:",
        subscription.company?.companyName
      );
      console.log(
        "Plan:",
        subscription.plan?.planName
      );
      console.log(
        "Subscription Status:",
        subscription.status
      );
      console.log(
        "Subscription Expiry:",
        subscription.expiryDate
      );

      const expiryDate = new Date(
        subscription.expiryDate
      );

      // ==========================================
      // 1. CHECK IF SUBSCRIPTION IS EXPIRED
      // ==========================================

      if (
        expiryDate <= now &&
        subscription.status === "ACTIVE"
      ) {

        console.log(
          `Expiring subscription ${subscription.id} for ${subscription.company.companyName}`
        );

        // Mark subscription as expired
        await prisma.subscription.update({
          where: {
            id: subscription.id
          },
          data: {
            status: "EXPIRED"
          }
        });

        // Mark company as expired
        await prisma.company.update({
          where: {
            id: subscription.companyId
          },
          data: {
            status: "EXPIRED"
          }
        });

        console.log(
          `Subscription ${subscription.id} marked as EXPIRED.`
        );

        continue;
      }

      // ==========================================
      // 2. ONLY CHECK ACTIVE / TRIAL SUBSCRIPTIONS
      // ==========================================

      if (
        subscription.status !== "ACTIVE" &&
        subscription.status !== "TRIAL"
      ) {
        continue;
      }

      // ==========================================
      // 3. CALCULATE DAYS REMAINING
      // ==========================================

      const difference =
        expiryDate.getTime() - now.getTime();

      const daysRemaining = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      console.log(
        "Days remaining:",
        daysRemaining
      );

      // ==========================================
      // 4. CHECK 3-DAY / 2-DAY REMINDER
      // ==========================================

      if (
        daysRemaining !== 3 &&
        daysRemaining !== 2
      ) {
        continue;
      }

      // ==========================================
      // 5. GET COMPANY EMAIL
      // ==========================================

      const recipientEmail =
        subscription.company?.email;

      if (!recipientEmail) {

        console.log(
          `No email found for company ${subscription.company?.companyName}`
        );

        continue;
      }

      // ==========================================
      // 6. CREATE UNIQUE REMINDER SUBJECT
      // ==========================================

      const reminderSubject =
        `Your ${subscription.plan.planName} subscription expires in ${daysRemaining} days`;

      // ==========================================
      // 7. CHECK WHETHER REMINDER WAS ALREADY SENT
      // ==========================================

      const existingReminder =
        await prisma.subscriptionReminder.findFirst({
          where: {
            subscriptionId: subscription.id,
            subject: reminderSubject,
            status: "SENT"
          }
        });

      if (existingReminder) {

        console.log(
          `Reminder already sent for subscription ${subscription.id}: ${daysRemaining} days`
        );

        continue;
      }

      // ==========================================
      // 8. EMAIL CONTENT
      // ==========================================

      const reminderContent = `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          line-height: 1.6;
        ">

          <h2>
            Subscription Expiry Reminder
          </h2>

          <p>
            Hello ${subscription.company.ownerName},
          </p>

          <p>
            This is a reminder that your
            <strong>
              ${subscription.plan.planName}
            </strong>
            subscription for
            <strong>
              ${subscription.company.companyName}
            </strong>
            will expire in
            <strong>
              ${daysRemaining} days
            </strong>.
          </p>

          <p>
            <strong>Expiry Date:</strong>
            ${expiryDate.toLocaleDateString()}
          </p>

          <p>
            Please renew your subscription before the
            expiry date to continue using all CRM features
            without interruption.
          </p>

          <p>
            If you have already renewed your subscription,
            please ignore this email.
          </p>

          <br />

          <p>
            Regards,<br />
            <strong>CRM Team</strong>
          </p>

        </div>
      `;

      // ==========================================
      // 9. SEND EMAIL
      // ==========================================

      console.log(
        `Sending ${daysRemaining}-day expiry reminder to ${recipientEmail}`
      );

      await sendEmail({
        to: recipientEmail,
        subject: reminderSubject,
        htmlContent: reminderContent
      });

      console.log(
        `Email sent successfully to ${recipientEmail}`
      );

      // ==========================================
      // 10. SAVE REMINDER HISTORY
      // ==========================================

      await prisma.subscriptionReminder.create({
        data: {
          subscriptionId: subscription.id,
          channel: "EMAIL",
          recipientEmail,
          subject: reminderSubject,
          content: reminderContent,
          status: "SENT",
          sentAt: new Date()
        }
      });

      console.log(
        `Reminder history saved for subscription ${subscription.id}`
      );
    }

    console.log("----------------------------------------");
    console.log(
      "Subscription expiry and reminder check completed."
    );
    console.log("----------------------------------------");

  } catch (error) {

    console.error(
      "Subscription expiry check failed:"
    );

    console.error(error);
  }
};

module.exports = {
  updateExpiredSubscriptions
};