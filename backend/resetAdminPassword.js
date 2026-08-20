const bcrypt = require("bcryptjs");
const prisma = require("./config/prisma");

async function resetPassword() {
  const email = "admin@crm.com";
  const newPassword = "Admin@12345";

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.superAdmin.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });

  console.log("Password reset successfully");
  console.log("Email:", admin.email);
  console.log("Password:", newPassword);

  await prisma.$disconnect();
}

resetPassword();