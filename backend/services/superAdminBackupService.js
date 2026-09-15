const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

const { ZipArchive } = require("archiver");

// ==========================================
// CREATE SUPER ADMIN BACKUP
// ==========================================

const createSuperAdminBackup = async (createdById) => {
    const startedAt = new Date();
    const backupId = `SAB-${Date.now()}`;

    let jsonFilePath = null;
    let zipFilePath = null;

    // ==========================================
    // CREATE BACKUP DATABASE RECORD
    // ==========================================

    const backup = await prisma.superAdminBackup.create({
        data: {
            backupId,
            backupType: "MANUAL",
            status: "IN_PROGRESS",
            startedAt,
            createdById: createdById || null,
        },
    });

    try {
        // ==========================================
        // FETCH SUPER ADMIN DATA ONLY
        // ==========================================

        const [
            companies,
            subscriptionPlans,
            subscriptions,
            subscriptionReminders,
            upgradeRequests,
            employees,
            notifications,
            supportTickets,
            supportTicketNotes,
            payments,
            testimonials,
            auditLogs,
        ] = await Promise.all([
            prisma.company.findMany(),
            prisma.subscriptionPlan.findMany(),
            prisma.subscription.findMany(),
            prisma.subscriptionReminder.findMany(),
            prisma.subscriptionUpgradeRequest.findMany(),
            prisma.employee.findMany(),
            prisma.notification.findMany(),
            prisma.supportTicket.findMany(),
            prisma.supportTicketNote.findMany(),
            prisma.payment.findMany(),
            prisma.testimonial.findMany(),
            prisma.auditLog.findMany(),
        ]);

        // ==========================================
        // PREPARE BACKUP DATA
        // ==========================================

        const backupData = {
            metadata: {
                backupId,
                backupType: "FULL",
                createdAt: new Date().toISOString(),
                version: "1.0",
            },

            // ======================================
            // SUPER ADMIN DATA ONLY
            // ======================================

            companies,
            subscriptionPlans,
            subscriptions,
            subscriptionReminders,
            upgradeRequests,
            employees,
            notifications,
            supportTickets,
            supportTicketNotes,
            payments,
            testimonials,
            auditLogs,
        };

        // ==========================================
        // CREATE BACKUP DIRECTORY
        // ==========================================

        const backupDirectory = path.join(
            __dirname,
            "../backups/super-admin"
        );

        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory, {
                recursive: true,
            });
        }

        // ==========================================
        // FILE NAMES
        // ==========================================

        const jsonFileName =
            `SuperAdmin_Backup_${backupId}.json`;

        const zipFileName =
            `SuperAdmin_Backup_${backupId}.zip`;

        jsonFilePath = path.join(
            backupDirectory,
            jsonFileName
        );

        zipFilePath = path.join(
            backupDirectory,
            zipFileName
        );

        // ==========================================
        // WRITE JSON BACKUP
        // ==========================================

        fs.writeFileSync(
            jsonFilePath,
            JSON.stringify(
                backupData,
                (key, value) => {
                    // Convert Prisma BigInt values
                    // into strings for JSON
                    if (typeof value === "bigint") {
                        return value.toString();
                    }

                    return value;
                },
                2
            ),
            "utf8"
        );

        console.log(
            "SUPER ADMIN BACKUP JSON CREATED:",
            jsonFilePath
        );

        // ==========================================
        // CREATE ZIP BACKUP
        // ==========================================

        const output = fs.createWriteStream(
            zipFilePath
        );

        const archive = new ZipArchive({
            zlib: {
                level: 9,
            },
        });

        // ==========================================
        // PIPE ARCHIVE TO ZIP FILE
        // ==========================================

        archive.pipe(output);

        // ==========================================
        // ADD JSON FILE TO ZIP
        // ==========================================

        archive.file(jsonFilePath, {
            name: jsonFileName,
        });

        // ==========================================
        // FINALIZE ZIP
        // ==========================================

        await new Promise((resolve, reject) => {
            let settled = false;

            const resolveOnce = () => {
                if (settled) return;

                settled = true;
                resolve();
            };

            const rejectOnce = (error) => {
                if (settled) return;

                settled = true;
                reject(error);
            };

            // ZIP output completely written
            output.on("close", resolveOnce);

            // Output stream error
            output.on("error", rejectOnce);

            // Archive error
            archive.on("error", rejectOnce);

            // Finalize archive
            archive
                .finalize()
                .catch(rejectOnce);
        });

        console.log(
            "SUPER ADMIN BACKUP ZIP CREATED:",
            zipFilePath
        );

        // ==========================================
        // VERIFY ZIP FILE
        // ==========================================

        if (!fs.existsSync(zipFilePath)) {
            throw new Error(
                "Backup ZIP file was not created."
            );
        }

        // ==========================================
        // VERIFY ZIP FILE SIZE
        // ==========================================

        const fileStats =
            fs.statSync(zipFilePath);

        if (fileStats.size <= 0) {
            throw new Error(
                "Backup ZIP file is empty."
            );
        }

        // ==========================================
        // DELETE TEMP JSON FILE
        // ==========================================

        if (
            jsonFilePath &&
            fs.existsSync(jsonFilePath)
        ) {
            fs.unlinkSync(jsonFilePath);
        }

        // ==========================================
        // UPDATE BACKUP DATABASE RECORD
        // ==========================================

        await prisma.superAdminBackup.update({
            where: {
                id: backup.id,
            },

            data: {
                status: "COMPLETED",

                fileName: zipFileName,

                storagePath: zipFilePath,

                fileSize: BigInt(
                    fileStats.size
                ),

                companiesCount:
                    companies.length,

                subscriptionPlansCount:
                    subscriptionPlans.length,

                subscriptionsCount:
                    subscriptions.length,

                subscriptionRemindersCount:
                    subscriptionReminders.length,

                upgradeRequestsCount:
                    upgradeRequests.length,

                employeesCount:
                    employees.length,

                notificationsCount:
                    notifications.length,

                supportTicketsCount:
                    supportTickets.length,

                supportTicketNotesCount:
                    supportTicketNotes.length,

                paymentsCount:
                    payments.length,

                testimonialsCount:
                    testimonials.length,

                auditLogsCount:
                    auditLogs.length,

                completedAt: new Date(),
            },
        });

        // ==========================================
        // SUCCESS LOG
        // ==========================================

        console.log(
            "========================================"
        );

        console.log(
            "SUPER ADMIN BACKUP CREATED SUCCESSFULLY"
        );

        console.log(
            "Backup ID:",
            backupId
        );

        console.log(
            "File:",
            zipFileName
        );

        console.log(
            "Size:",
            fileStats.size,
            "bytes"
        );

        console.log(
            "========================================"
        );

        // ==========================================
        // RETURN SUCCESS
        // ==========================================

        return {
            success: true,
            backupId,
            fileName: zipFileName,
            filePath: zipFilePath,
        };
    } catch (error) {
        // ==========================================
        // ERROR LOG
        // ==========================================

        console.error(
            "========================================"
        );

        console.error(
            "SUPER ADMIN BACKUP ERROR:"
        );

        console.error(error);

        console.error(
            "========================================"
        );

        // ==========================================
        // CLEAN TEMP JSON FILE
        // ==========================================

        try {
            if (
                jsonFilePath &&
                fs.existsSync(jsonFilePath)
            ) {
                fs.unlinkSync(jsonFilePath);

                console.log(
                    "Temporary JSON backup deleted."
                );
            }
        } catch (cleanupError) {
            console.error(
                "JSON BACKUP CLEANUP ERROR:",
                cleanupError
            );
        }

        // ==========================================
        // CLEAN FAILED ZIP FILE
        // ==========================================

        try {
            if (
                zipFilePath &&
                fs.existsSync(zipFilePath)
            ) {
                fs.unlinkSync(zipFilePath);

                console.log(
                    "Failed ZIP backup deleted."
                );
            }
        } catch (cleanupError) {
            console.error(
                "ZIP BACKUP CLEANUP ERROR:",
                cleanupError
            );
        }

        // ==========================================
        // MARK BACKUP AS FAILED
        // ==========================================

        try {
            await prisma.superAdminBackup.update({
                where: {
                    id: backup.id,
                },

                data: {
                    status: "FAILED",

                    errorMessage:
                        error.message ||
                        "Unknown backup error",

                    completedAt: new Date(),
                },
            });
        } catch (databaseError) {
            console.error(
                "FAILED TO UPDATE BACKUP STATUS:",
                databaseError
            );
        }

        // ==========================================
        // THROW ORIGINAL ERROR
        // ==========================================

        throw error;
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createSuperAdminBackup,
};