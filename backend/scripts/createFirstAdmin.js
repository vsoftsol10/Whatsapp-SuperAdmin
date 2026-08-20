/**
 * One-time helper to create the very first Super Admin account.
 *
 * The /api/auth/register route now requires an existing logged-in
 * Super Admin (to stop anyone from self-registering as admin).
 * If you don't have any Super Admin in the database yet, run this
 * script once to create one, then log in normally at /api/auth/login.
 *
 * Usage:
 *   node scripts/createFirstAdmin.js "Admin Name" "admin@example.com" "StrongPassword123!"
 */

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.error(
      'Usage: node scripts/createFirstAdmin.js "Admin Name" "admin@example.com" "StrongPassword123!"'
    );
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.superAdmin.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    console.error("A Super Admin with this email already exists.");
    process.exit(1);
  }

  const existingCount = await prisma.superAdmin.count();

  if (existingCount > 0) {
    console.error(
      "A Super Admin already exists in this database. Log in and use /api/auth/register instead."
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.superAdmin.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  console.log("Super Admin created successfully:");
  console.log({ id: admin.id, name: admin.name, email: admin.email });

  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create Super Admin:", err.message);
  process.exit(1);
});
