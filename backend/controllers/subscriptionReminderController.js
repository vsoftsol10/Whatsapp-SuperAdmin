
const prisma = require("../config/prisma");
const { sendEmail } = require("../services/brevoService");

const sendSubscriptionReminder = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { channel, subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required"
      });
    }

    if (channel && channel !== "EMAIL") {
      return res.status(400).json({
        success: false,
        message: "Only EMAIL channel is supported"
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        id: Number(subscriptionId)
      },
      include: {
        company: true,
        plan: true
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    const recipientEmail = subscription.company.email;

    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: "Company email not found"
      });
    }

    await sendEmail({
      to: recipientEmail,
      subject,
      htmlContent: content
    });

    const reminder = await prisma.subscriptionReminder.create({
      data: {
        subscriptionId: subscription.id,
        channel: "EMAIL",
        recipientEmail,
        subject,
        content,
        status: "SENT",
        sentAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: "Reminder sent successfully",
      reminder
    });
  } catch (error) {
    console.error("Send subscription reminder error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send subscription reminder"
    });
  }
};

const getSubscriptionReminders = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: {
        id: Number(subscriptionId)
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found"
      });
    }

    const reminders = await prisma.subscriptionReminder.findMany({
      where: {
        subscriptionId: subscription.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      reminders
    });
  } catch (error) {
    console.error("Get subscription reminders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription reminders"
    });
  }
};

module.exports = {
  sendSubscriptionReminder,
  getSubscriptionReminders
};

