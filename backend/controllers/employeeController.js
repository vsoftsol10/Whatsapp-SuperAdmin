
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const {
  sendEmployeeCredentialsEmail
} = require("../services/employeeEmailService");

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
  let password = "";

  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};



const generateEmployeeId = async () => {
  const lastEmployee = await prisma.employee.findFirst({
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!lastEmployee) {
    return "EMP001";
  }

  const lastNumber = parseInt(
    lastEmployee.employeeId.replace("EMP", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `EMP${String(nextNumber).padStart(3, "0")}`;
};

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      role
    } = req.body;

    // ==========================================
    // DATABASE VALIDATION
    // ==========================================

    const existingEmployee = await prisma.employee.findUnique({
      where: {
        email
      }
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists"
      });
    }

    const existingPhone = await prisma.employee.findFirst({
      where: {
        phone
      }
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Employee with this phone number already exists"
      });
    }

    // ==========================================
    // EXISTING CREATION LOGIC
    // ==========================================

    const employeeId = await generateEmployeeId();

    const temporaryPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        role: role || "EMPLOYEE",
        status: "ACTIVE",
        mustChangePassword: true
      }
    });

    console.log("Employee created:", {
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email
    });

    await sendEmployeeCredentialsEmail({
      employeeName: employee.name,
      employeeEmail: employee.email,
      employeeId: employee.employeeId,
      password: temporaryPassword
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        role: employee.role,
        status: employee.status
      },
      temporaryPassword
    });

  } catch (error) {
    console.error("Create employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee"
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employees"
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      employee
    });
  } catch (error) {
    console.error("Get employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employee"
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const {
      name,
      email,
      phone,
      address,
      role,
      status
    } = req.body;

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const emailExists = await prisma.employee.findFirst({
      where: {
        email,
        NOT: {
          employeeId
        }
      }
    });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const updatedEmployee = await prisma.employee.update({
      where: {
        employeeId
      },
      data: {
        name,
        email,
        phone,
        address,
        role,
        status
      }
    });

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee
    });

  } catch (error) {
    console.error("Update employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee"
    });
  }
};


const changeEmployeeStatus = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "ACTIVE",
      "INACTIVE"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee status"
      });
    }

    const employee = await prisma.employee.update({
      where: {
        employeeId
      },
      data: {
        status
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Employee status updated successfully",
      employee
    });
  } catch (error) {
    console.error("Change employee status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee status"
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    await prisma.employee.delete({
      where: {
        employeeId
      }
    });

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete employee"
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  changeEmployeeStatus,
  deleteEmployee
};

