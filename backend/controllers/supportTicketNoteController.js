const prisma = require("../config/prisma");


// GET NOTES BY TICKET ID
const getSupportTicketNotes = async (req, res) => {
  try {

    const ticketId = Number(req.params.ticketId);

    const notes = await prisma.supportTicketNote.findMany({
      where: {
        supportTicketId: ticketId
      },
      orderBy: {
        createdAt: "desc"
      }
    });


    res.status(200).json({
      success: true,
      notes
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch notes"
    });

  }
};



// CREATE NOTE
const createSupportTicketNote = async (req, res) => {
  try {
    const ticketId = Number(req.params.ticketId);

    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note is required"
      });
    }

    // Get logged-in user from JWT
    const userId = req.user.id;
    const userRole = req.user.role;

    let createdById;
    let createdByName;

    // ==============================
    // SUPER ADMIN
    // ==============================

    if (userRole === "SUPER_ADMIN") {

      const admin = await prisma.superAdmin.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true
        }
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Super Admin not found"
        });
      }

      createdById = admin.id;
      createdByName = admin.name;
    }

    // ==============================
    // EMPLOYEE
    // ==============================

    else if (userRole === "EMPLOYEE") {

      const employee = await prisma.employee.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true
        }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found"
        });
      }

      createdById = employee.id;
      createdByName = employee.name;
    }

    else {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add notes"
      });
    }

    // ==============================
    // CREATE NOTE
    // ==============================

    const newNote = await prisma.supportTicketNote.create({
      data: {
        supportTicketId: ticketId,
        note: note.trim(),
        createdById,
        createdByName
      }
    });

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote
    });

  } catch (error) {

    console.error("Create Support Ticket Note Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add note"
    });
  }
};


module.exports={
 getSupportTicketNotes,
 createSupportTicketNote
};