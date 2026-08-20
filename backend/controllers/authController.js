const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Super Admin created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("LOGIN CONTROLLER CALLED");
    console.log("Login body:", req.body);

    const result = await authService.login(req.body);

    console.log("LOGIN SUCCESS");

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {

    const result = await authService.changePassword(
      req.user.id,
      req.user.role,
      req.body
    );

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

const profile = async (req, res) => {
  try {
    const result = await authService.profile(req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(
      req.body.email
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const result = await authService.resetPassword(
      token,
      newPassword,
      confirmPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  profile,
  changePassword,
  forgotPassword,
  resetPassword,
};