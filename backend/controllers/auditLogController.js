const prisma = require("../config/prisma");

const getAuditLogs = async (req, res) => {
  try {

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      count: auditLogs.length,
      auditLogs
    });

  } catch (error) {

    console.error("Get Audit Logs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs"
    });

  }
};

module.exports = {
  getAuditLogs
};