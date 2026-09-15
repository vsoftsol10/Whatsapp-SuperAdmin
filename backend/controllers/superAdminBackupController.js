const prisma = require("../config/prisma");
const {
  createSuperAdminBackup,
} = require("../services/superAdminBackupService");

// ==========================================
// CREATE BACKUP
// ==========================================

const createBackup = async (req, res) => {
  try {
    const createdById =
      req.user?.id ||
      req.user?.userId ||
      null;

    const result = await createSuperAdminBackup(createdById);

    return res.status(201).json({
      success: true,
      message: "Super Admin backup created successfully.",
      backupId: result.backupId,
      fileName: result.fileName,
    });
  } catch (error) {
    console.error(
      "CREATE SUPER ADMIN BACKUP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create Super Admin backup.",
      error: error.message,
    });
  }
};

// ==========================================
// GET BACKUP HISTORY
// ==========================================

const getBackups = async (req, res) => {
  try {
    const backups = await prisma.superAdminBackup.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        backupId: true,
        backupType: true,
        status: true,
        fileName: true,
        fileSize: true,

        companiesCount: true,
        subscriptionPlansCount: true,
        subscriptionsCount: true,
        subscriptionRemindersCount: true,
        upgradeRequestsCount: true,
        employeesCount: true,
        notificationsCount: true,
        supportTicketsCount: true,
        supportTicketNotesCount: true,
        paymentsCount: true,
        testimonialsCount: true,
        auditLogsCount: true,

        startedAt: true,
        completedAt: true,
        errorMessage: true,
        createdById: true,
        createdAt: true,
      },
    });

    const formattedBackups = backups.map((backup) => ({
      ...backup,
      fileSize: backup.fileSize
        ? backup.fileSize.toString()
        : null,
    }));

    return res.status(200).json({
      success: true,
      count: formattedBackups.length,
      backups: formattedBackups,
    });
  } catch (error) {
    console.error(
      "GET SUPER ADMIN BACKUPS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch backup history.",
      error: error.message,
    });
  }
};

// ==========================================
// DOWNLOAD BACKUP
// ==========================================

const downloadBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await prisma.superAdminBackup.findUnique({
      where: {
        id,
      },
    });

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: "Backup not found.",
      });
    }

    if (backup.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Backup is not available for download.",
      });
    }

    if (!backup.storagePath || !backup.fileName) {
      return res.status(404).json({
        success: false,
        message: "Backup file not found.",
      });
    }

    const fs = require("fs");

    if (!fs.existsSync(backup.storagePath)) {
      return res.status(404).json({
        success: false,
        message: "Backup file does not exist on the server.",
      });
    }

    return res.download(
      backup.storagePath,
      backup.fileName
    );
  } catch (error) {
    console.error(
      "DOWNLOAD SUPER ADMIN BACKUP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to download backup.",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE BACKUP
// ==========================================

const deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // FIND BACKUP
    // ==========================================

    const backup =
      await prisma.superAdminBackup.findUnique({
        where: {
          id,
        },
      });

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: "Backup not found.",
      });
    }

    // ==========================================
    // DELETE BACKUP FILE
    // ==========================================

    const fs = require("fs");

    if (
      backup.storagePath &&
      fs.existsSync(backup.storagePath)
    ) {
      fs.unlinkSync(backup.storagePath);

      console.log(
        "BACKUP FILE DELETED:",
        backup.storagePath
      );
    }

    // ==========================================
    // DELETE DATABASE RECORD
    // ==========================================

    await prisma.superAdminBackup.delete({
      where: {
        id,
      },
    });

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Backup deleted successfully.",
      backupId: backup.backupId,
    });
  } catch (error) {
    console.error(
      "DELETE SUPER ADMIN BACKUP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete backup.",
      error: error.message,
    });
  }
};

module.exports = {
  createBackup,
  getBackups,
  downloadBackup,
  deleteBackup,
};