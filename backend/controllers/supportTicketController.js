const prisma = require("../config/prisma");


const createSupportTicket = async (req, res) => {
  try {
    const {
      companyId: requestedCompanyId,
      employeeId,
      title,
      description,
      priority
    } = req.body;

    // =====================================================
    // DETERMINE COMPANY
    // =====================================================

    let companyId;

    // SUPER ADMIN
    // Company is selected manually from the form
    if (req.user.role === "SUPER_ADMIN") {
      if (!requestedCompanyId) {
        return res.status(400).json({
          success: false,
          message: "Company is required."
        });
      }

      companyId = Number(requestedCompanyId);
    }

    // WHATSAPP CRM USER
    // Company comes from logged-in user's JWT
    else if (req.user.companyId) {
      companyId = Number(req.user.companyId);
    }

    else {
      return res.status(401).json({
        success: false,
        message: "Company information not found."
      });
    }

    // =====================================================
    // VALIDATE TITLE & DESCRIPTION
    // =====================================================

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required."
      });
    }

    // =====================================================
    // CHECK COMPANY
    // =====================================================

    const company = await prisma.company.findUnique({
      where: {
        id: companyId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found."
      });
    }

    // =====================================================
    // EMPLOYEE ASSIGNMENT
    // =====================================================

    let finalEmployeeId = null;

    // Only Super Admin can assign an employee
    if (
      req.user.role === "SUPER_ADMIN" &&
      employeeId
    ) {
      const employee = await prisma.employee.findUnique({
        where: {
          id: employeeId
        }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found."
        });
      }

      finalEmployeeId = employeeId;
    }

    // =====================================================
    // CREATE SUPPORT TICKET
    // =====================================================

    const ticket = await prisma.supportTicket.create({
      data: {
        companyId,

        employeeId: finalEmployeeId,

        title: title.trim(),

        description: description.trim(),

        priority: priority || "MEDIUM",

        status: "OPEN"
      },

      include: {
        company: true,
        assignedTo: true
      }
    });

    // =====================================================
    // NOTIFY ASSIGNED EMPLOYEE
    // =====================================================

    if (finalEmployeeId) {
      try {
        await prisma.notification.create({
          data: {
            employeeId: finalEmployeeId,

            title: "New Support Ticket",

            message:
              `A new support ticket "${ticket.title}" has been assigned to you.`
          }
        });
      } catch (notificationError) {
        console.error(
          "Support ticket notification failed:",
          notificationError
        );
      }
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      ticket
    });

  } catch (error) {
    console.error(
      "Create Support Ticket Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket."
    });
  }
};


const getSupportTickets = async (req, res) => {
  try {

    let where = {};

    // Employee can only see their assigned tickets
    if (req.user.role === "EMPLOYEE") {
      where.employeeId = req.user.id;
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        company: true,
        assignedTo: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets."
    });

  }
};

const getSupportTicketById = async (req, res) => {
  try {

    const { id } = req.params;

    let where = {
      id: Number(id)
    };

    if (req.user.role === "EMPLOYEE") {
      where.employeeId = req.user.id;
    }

    const ticket = await prisma.supportTicket.findFirst({
      where,
      include: {
        company: true,
        assignedTo: true
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket."
    });

  }
};

const updateSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      priority,
      status,
      employeeId
    } = req.body;

    const ticketId = Number(id);

    // ============================================
    // FIND TICKET
    // ============================================

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: ticketId
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    // ============================================
    // VALIDATE EMPLOYEE
    // ============================================

    let finalEmployeeId = null;

    if (employeeId) {
      const employee = await prisma.employee.findUnique({
        where: {
          id: employeeId
        }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found."
        });
      }

      finalEmployeeId = employeeId;
    }

    // ============================================
    // UPDATE TICKET
    // ============================================

    const updatedTicket = await prisma.supportTicket.update({
      where: {
        id: ticketId
      },

      data: {
        title: title?.trim(),
        description: description?.trim(),
        priority,
        status,

        // THIS WAS MISSING
        employeeId: finalEmployeeId
      },

      include: {
        company: true,
        assignedTo: true
      }
    });

    // ============================================
    // NOTIFY SUPER ADMIN
    // ============================================
    if (req.user.role === "EMPLOYEE") {
      try {

        // Find the logged-in employee
        const employee = await prisma.employee.findUnique({
          where: {
            id: req.user.id
          }
        });

        const superAdmin = await prisma.superAdmin.findFirst();

        if (superAdmin) {

          await prisma.notification.create({
            data: {
              superAdminId: superAdmin.id,

              title: "Support Ticket Updated",

              message:
                `Employee "${employee?.name || "Employee"}" changed the status of support ticket "${updatedTicket.title}" to "${status}".`
            }
          });

          console.log("Super Admin notification created successfully.");

        } else {

          console.log("No Super Admin found.");

        }

      } catch (notificationError) {

        console.error(
          "Super Admin notification failed:",
          notificationError
        );

      }
    }

    // ============================================
    // NOTIFY EMPLOYEE
    // ============================================

    if (
      finalEmployeeId &&
      finalEmployeeId !== ticket.employeeId
    ) {
      try {
        await prisma.notification.create({
          data: {
            employeeId: finalEmployeeId,
            title: "Support Ticket Assigned",
            message: `Support ticket "${updatedTicket.title}" has been assigned to you.`
          }
        });
      } catch (notificationError) {
        console.error(
          "Support ticket notification failed:",
          notificationError
        );
      }
    }

    // ============================================
    // NOTIFY SUPER ADMIN WHEN EMPLOYEE UPDATES
    // ============================================

    if (req.user.role === "EMPLOYEE") {
      try {
        await prisma.notification.create({
          data: {
            superAdminId: req.user.superAdminId,
            title: "Support Ticket Updated",
            message: `Employee "${req.user.name}" updated support ticket "${updatedTicket.title}".`
          }
        });
      } catch (notificationError) {
        console.error(
          "Super Admin notification failed:",
          notificationError
        );
      }
    }

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      message: "Support ticket updated successfully.",
      ticket: updatedTicket
    });

  } catch (error) {
    console.error(
      "Update Support Ticket Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update support ticket."
    });
  }
};
const assignSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const { employeeId } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found."
      });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: {
        id: Number(id)
      },
      data: {
        employeeId,
        status: "IN_PROGRESS"
      },
      include: {
        company: true,
        assignedTo: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Ticket assigned successfully.",
      ticket: updatedTicket
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign ticket."
    });
  }
};

const changeSupportTicketStatus = async (req, res) => {
  try {

    console.log("====================================");
    console.log("SUPPORT TICKET STATUS UPDATE");
    console.log("USER:", req.user);
    console.log("TICKET ID:", req.params.id);
    console.log("NEW STATUS:", req.body.status);
    console.log("====================================");
    const { id } = req.params;

    const { status } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      },
      include: {
        company: true,
        assignedTo: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully.",
      ticket: updatedTicket
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update ticket status."
    });
  }
};

const deleteSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found."
      });
    }

    await prisma.supportTicket.delete({
      where: {
        id: Number(id)
      }
    });

    res.status(200).json({
      success: true,
      message: "Support ticket deleted successfully."
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete support ticket."
    });
  }
};

module.exports = {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  assignSupportTicket,
  changeSupportTicketStatus,
  deleteSupportTicket
};