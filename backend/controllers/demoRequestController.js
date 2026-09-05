const { sendEmail } = require("../services/brevoService");

const createDemoRequest = async (req, res) => {
  try {
    const {
      companyName,
      ownerName,
      phone,
      email,
      location,
      address,
      requirements,
    } = req.body;

    // ============================================
    // 1. VALIDATE REQUIRED FIELDS
    // ============================================

    if (
      !companyName ||
      !ownerName ||
      !phone ||
      !email ||
      !location ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ============================================
    // 2. SEND EMAIL TO COMPANY
    // ============================================

    await sendEmail({
      to: process.env.BREVO_RECEIVER_EMAIL,
      subject: `New Demo Request - ${companyName}`,
      htmlContent: `
        <h2>New WhatsApp CRM Demo Request</h2>

        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Owner Name:</strong> ${ownerName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${normalizedEmail}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Requirements:</strong> ${
          requirements || "Not provided"
        }</p>

        <hr />

        <p>This demo request was submitted from the WhatsApp CRM landing page.</p>
      `,
    });

    // ============================================
    // 3. RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      message: "Demo request submitted successfully",
    });

  } catch (error) {
    console.error("Create demo request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit demo request",
      error: error.message,
    });
  }
};

module.exports = {
  createDemoRequest,
};