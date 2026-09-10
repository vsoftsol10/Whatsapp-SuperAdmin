const prisma = require("../config/prisma");

// Get all testimonials - Super Admin
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({
      message: "Failed to fetch testimonials",
    });
  }
};

// Get published testimonials - Landing Page
const getPublishedTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Get published testimonials error:", error);
    res.status(500).json({
      message: "Failed to fetch published testimonials",
    });
  }
};

// Create testimonial
const createTestimonial = async (req, res) => {
  try {
    const {
      customerName,
      designation,
      companyName,
      content,
      rating,
      status,
      displayOrder,
      isFeatured,
    } = req.body;

    if (!customerName || !content) {
      return res.status(400).json({
        message: "Customer name and review content are required",
      });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        designation: designation || null,
        companyName: companyName || null,
        content,
        rating: rating || 5,
        status: status || "DRAFT",
        displayOrder: displayOrder || 0,
        isFeatured: isFeatured || false,
      },
    });

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create testimonial error:", error);
    res.status(500).json({
      message: "Failed to create testimonial",
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customerName,
      designation,
      companyName,
      content,
      rating,
      status,
      displayOrder,
      isFeatured,
    } = req.body;

    if (!customerName || !content) {
      return res.status(400).json({
        message: "Customer name and review content are required",
      });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: {
        id: Number(id),
      },
      data: {
        customerName,
        designation: designation || null,
        companyName: companyName || null,
        content,
        rating: rating || 5,
        status: status || "DRAFT",
        displayOrder: displayOrder || 0,
        isFeatured: isFeatured || false,
      },
    });

    res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(500).json({
      message: "Failed to update testimonial",
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete testimonial",
    });
  }
};

module.exports = {
  getTestimonials,
  getPublishedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};