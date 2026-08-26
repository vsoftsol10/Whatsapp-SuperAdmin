const prisma = require("../config/prisma");

// ==========================================
// GET ALL AUDIT LOGS
// ==========================================

const getAuditLogs = async (req, res) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: auditLogs.length,
      auditLogs,
    });

  } catch (error) {
    console.error("Get Audit Logs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};


// ==========================================
// GET SINGLE AUDIT LOG
// ==========================================

const getAuditLogById = async (req, res) => {
  try {

    const { id } = req.params;

    const auditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });

    if (!auditLog) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
      });
    }

    res.status(200).json({
      success: true,
      auditLog,
    });

  } catch (error) {

    console.error("Get Audit Log By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit log",
    });

  }
};


// ==========================================
// DELETE AUDIT LOG
// ==========================================

const deleteAuditLog = async (req, res) => {
  try {

    const { id } = req.params;

    // Check whether audit log exists
    const auditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });

    if (!auditLog) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
      });
    }

    // Delete audit log
    await prisma.auditLog.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Audit log deleted successfully",
    });

  } catch (error) {

    console.error("Delete Audit Log Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete audit log",
    });

  }
};


module.exports = {
  getAuditLogs,
  getAuditLogById,
  deleteAuditLog,
};