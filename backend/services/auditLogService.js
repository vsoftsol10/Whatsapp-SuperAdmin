const prisma = require("../config/prisma");

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
    return await prisma.auditLog.create({
      data: {
        actorId,
        actorType,
        action,
        entityType,
        entityId: entityId ? String(entityId) : null,
        companyId,
        description,
        oldValue,
        newValue,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Audit logging should not break the main operation
    console.error("Audit log creation failed:", error.message);

    return null;
  }
};

module.exports = {
  createAuditLog,
};