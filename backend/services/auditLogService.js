

const prisma = require("../config/prisma");

// ==========================================
// CREATE AUDIT LOG
// ==========================================

const createAuditLog = async ({
  actorId = null,
  actorType = null,
  action,
  entityType,
  entityId = null,
  companyId = null,
  description = null,
  oldValue = null,
  newValue = null,
  ipAddress = null,
  userAgent = null,
}) => {
  try {

    // ==========================================
    // FIND ACTOR NAME
    // ==========================================

    let actorName = null;

    // SUPER ADMIN
    if (
      actorId &&
      actorType === "SUPER_ADMIN"
    ) {
      const admin = await prisma.superAdmin.findUnique({
        where: {
          id: actorId,
        },
        select: {
          name: true,
        },
      });

      actorName = admin?.name || null;
    }

    // EMPLOYEE
    if (
      actorId &&
      actorType === "EMPLOYEE"
    ) {
      const employee = await prisma.employee.findUnique({
        where: {
          id: actorId,
        },
        select: {
          name: true,
        },
      });

      actorName = employee?.name || null;
    }

    // ==========================================
    // CREATE AUDIT LOG
    // ==========================================

    return await prisma.auditLog.create({
      data: {
        actorId,
        actorType,
        actorName,

        action,
        entityType,

        entityId: entityId
          ? String(entityId)
          : null,

        companyId,

        description,

        oldValue,
        newValue,

        ipAddress,
        userAgent,
      },
    });

  } catch (error) {

    console.error(
      "Audit log creation failed:",
      error.message
    );

    return null;
  }
};


// ==========================================
// GET ALL AUDIT LOGS
// ==========================================

const getAllAuditLogs = async () => {
  try {
    return await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error(
      "Get audit logs failed:",
      error.message
    );

    throw error;
  }
};


// ==========================================
// GET SINGLE AUDIT LOG
// ==========================================

const getAuditLogById = async (id) => {
  try {
    return await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "Get audit log by ID failed:",
      error.message
    );

    throw error;
  }
};


// ==========================================
// DELETE AUDIT LOG
// ==========================================

const deleteAuditLog = async (id) => {
  try {
    const auditLog = await prisma.auditLog.findUnique({
      where: {
        id,
      },
    });

    if (!auditLog) {
      return null;
    }

    return await prisma.auditLog.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "Delete audit log failed:",
      error.message
    );

    throw error;
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById,
  deleteAuditLog,
};