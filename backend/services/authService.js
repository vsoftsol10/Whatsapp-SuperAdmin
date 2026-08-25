
const { createAuditLog } = require("./auditLogService");
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("./brevoService");
const {
  sendSuperAdminPasswordResetEmail
} = require("./passwordResetEmailService");

const register = async (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingAdmin = await prisma.superAdmin.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.superAdmin.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email
  };
};

const login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email and Password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  let user = null;
  let role = null;

  // =========================
  // CHECK SUPER ADMIN
  // =========================

  const admin = await prisma.superAdmin.findUnique({
    where: {
      email: normalizedEmail
    }
  });

  console.log("Login email:", normalizedEmail);
  console.log("Super Admin found:", !!admin);

  if (admin) {
    console.log("Admin ID:", admin.id);
    console.log("Admin email from DB:", admin.email);
    console.log("Password hash exists:", !!admin.password);
  }

  if (admin) {
    user = admin;
    role = "SUPER_ADMIN";
  } else {

    // =========================
    // CHECK EMPLOYEE
    // =========================

    const employee = await prisma.employee.findUnique({
      where: {
        email: normalizedEmail
      }
    });

    if (employee) {

      if (employee.status !== "ACTIVE") {
        throw new Error("Your employee account is inactive. Please contact the administrator.");
      }

      user = employee;
      role = "EMPLOYEE";
    }
  }

  // =========================
  // USER NOT FOUND
  // =========================

  if (!user) {
    await createAuditLog({
      actorId: null,
      actorType: "UNKNOWN",
      action: "LOGIN_FAILED",
      entityType: "AUTHENTICATION",
      description: `Failed login attempt for ${normalizedEmail}`,
    });

    throw new Error("Invalid email or password");
  }

  // =========================
  // CHECK EMPLOYEE STATUS
  // =========================

  if (
    role === "EMPLOYEE" &&
    user.status !== "ACTIVE"
  ) {
    throw new Error("Your employee account is inactive");
  }

  // =========================
  // CHECK PASSWORD
  // =========================

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    await createAuditLog({
      actorId: user.id,
      actorType: role,
      action: "LOGIN_FAILED",
      entityType: role,
      entityId: user.id,
      description: `Failed login attempt for ${user.email}`,
    });

    throw new Error("Invalid email or password");
  }

  // =========================
  // CREATE TOKEN
  // =========================

  const token = jwt.sign(
    {
      id: user.id,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  await createAuditLog({
    actorId: user.id,
    actorType: role,
    action: "LOGIN_SUCCESS",
    entityType: role,
    entityId: user.id,
    description: `${role} logged in successfully`,
  });

  // =========================
  // SUPER ADMIN
  // =========================

  if (role === "SUPER_ADMIN") {
    return {
      token,
      role,

      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  // =========================
  // EMPLOYEE
  // =========================

  return {
    token,
    role,

    employee: {
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      status: user.status,
      mustChangePassword: user.mustChangePassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  };
};

const profile = async (id) => {
  const admin = await prisma.superAdmin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  if (!admin) {
    throw new Error("Super Admin not found");
  }

  return admin;
};

const changePassword = async (id, role, data) => {

  const {
    currentPassword,
    newPassword,
    confirmPassword
  } = data;

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    throw new Error("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New Password and Confirm Password do not match");
  }

  let user = null;

  if (role === "SUPER_ADMIN") {

    user = await prisma.superAdmin.findUnique({
      where: {
        id
      }
    });

  } else {

    user = await prisma.employee.findUnique({
      where: {
        id
      }
    });

  }

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error("Current Password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  if (role === "SUPER_ADMIN") {

    await prisma.superAdmin.update({
      where: {
        id
      },
      data: {
        password: hashedPassword
      }
    });

  } else {

    await prisma.employee.update({
      where: {
        id
      },
      data: {
        password: hashedPassword,
        mustChangePassword: false
      }
    });

  }

  return {
    message: "Password updated successfully"
  };

};

const forgotPassword = async (email, ipAddress, userAgent) => {

  console.log("=================================");
  console.log("FORGOT PASSWORD CALLED");
  console.log("Email received:", email);
  console.log("=================================");

  if (!email) {
    throw new Error("Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  console.log("Normalized email:", normalizedEmail);

  // =====================================
  // CHECK SUPER ADMIN
  // =====================================

  let user = await prisma.superAdmin.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  let role = "SUPER_ADMIN";

  // =====================================
  // IF NOT SUPER ADMIN, CHECK EMPLOYEE
  // =====================================

  if (!user) {

    user = await prisma.employee.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    role = "EMPLOYEE";
  }

  console.log(
    "User found:",
    user ? user.email : "NO"
  );

  console.log(
    "Role:",
    user ? role : "NONE"
  );

  // =====================================
  // DON'T REVEAL WHETHER EMAIL EXISTS
  // =====================================

  if (!user) {

    console.log("No account found");

    return {
      message:
        "If the email exists, a password reset link has been sent.",
    };
  }

  // =====================================
  // CHECK EMPLOYEE STATUS
  // =====================================

  if (
    role === "EMPLOYEE" &&
    user.status !== "ACTIVE"
  ) {
    throw new Error(
      "Your employee account is inactive. Please contact the administrator."
    );
  }

  // =====================================
  // GENERATE RESET TOKEN
  // =====================================

  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  const resetTokenExpiry = new Date(
    Date.now() + 15 * 60 * 1000
  );

  console.log("Reset token generated");

  // =====================================
  // SAVE TOKEN
  // =====================================

  if (role === "SUPER_ADMIN") {

    await prisma.superAdmin.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

  } else {

    await prisma.employee.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

  }

  console.log("Reset token saved");

  // =====================================
  // RESET LINK
  // =====================================

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  console.log("Reset link:", resetLink);

  // =====================================
  // EMAIL
  // =====================================

  const htmlContent = `
    <div style="
      font-family:Arial,sans-serif;
      max-width:600px;
      margin:auto;
    ">

      <h2 style="color:#111827;">
        Password Reset Request
      </h2>

      <p style="color:#4b5563;">
        Hello ${user.name},
      </p>

      <p style="color:#4b5563;line-height:1.6;">
        We received a request to reset your password.
      </p>

      <div style="
        margin:30px 0;
        text-align:center;
      ">

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#111827;
            color:white;
            text-decoration:none;
            border-radius:6px;
            font-weight:600;
          "
        >
          Reset Password
        </a>

      </div>

      <p style="color:#6b7280;">
        This link will expire in 15 minutes.
      </p>

      <p style="color:#6b7280;">
        If you did not request this password reset,
        you can safely ignore this email.
      </p>

    </div>
  `;

  console.log("About to send email");

  try {

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      htmlContent,
    });

    await createAuditLog({
      actorId: user.id,
      actorType: role,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: role,
      entityId: user.id,
      description: `${role} requested a password reset and reset email was sent`,
      ipAddress,
      userAgent,
    });

    console.log("=================================");
    console.log("PASSWORD RESET EMAIL SENT");
    console.log("Email:", user.email);
    console.log("Role:", role);
    console.log("=================================");

  } catch (error) {

    console.error("=================================");
    console.error("PASSWORD RESET EMAIL FAILED");
    console.error(error);
    console.error("=================================");

    // Remove token if email failed

    if (role === "SUPER_ADMIN") {

      await prisma.superAdmin.update({
        where: {
          id: user.id,
        },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

    } else {

      await prisma.employee.update({
        where: {
          id: user.id,
        },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

    }

    throw new Error(
      "Unable to send password reset email"
    );
  }

  return {
    message:
      "If the email exists, a password reset link has been sent.",
  };
};

const resetPassword = async (
  token,
  newPassword,
  confirmPassword,
  ipAddress,
  userAgent
) => {

  if (!token || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New Password and Confirm Password do not match");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check Super Admin
  let user = await prisma.superAdmin.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  let role = "SUPER_ADMIN";

  // If not Super Admin, check Employee
  if (!user) {
    user = await prisma.employee.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    role = "EMPLOYEE";
  }

  if (!user) {
    throw new Error("Invalid or expired password reset link");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and remove token
  if (role === "SUPER_ADMIN") {
    await prisma.superAdmin.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  } else {
    await prisma.employee.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        mustChangePassword: false,
      },
    });
  }

  // =====================================
  // PASSWORD RESET AUDIT
  // =====================================

  await createAuditLog({
    actorId: user.id,
    actorType: role,
    action: "PASSWORD_RESET",
    entityType: role,
    entityId: user.id,
    description: `${role} password was reset successfully`,
    ipAddress,
    userAgent,
  });

  return {
    message: "Password reset successfully",
  };
};

module.exports = {
  register,
  login,
  profile,
  changePassword,
  forgotPassword,
  resetPassword,
};

