const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: "24h" },
  );
};

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
        updatedAt: new Date(),
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("Login failed: User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.email);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Login failed: Invalid password for user:", user.email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password validation successful for user:", user.email);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    console.log("JWT token generated for user:", user.email);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    logger.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
    });

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.users.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    logger.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Forgot Password: send reset email with time-limited token
const emailService = require("../services/email.service");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });

    // Return 200 even if user not found to avoid account enumeration
    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link has been sent." });
    }

    const resetToken = jwt.sign(
      { userId: user.id, action: "reset_password" },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1h" },
    );

    await emailService.sendPasswordResetEmail(
      user.email,
      user.name || "User",
      resetToken,
    );
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    logger.error("Forgot password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password: verify token and update password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (payload.action !== "reset_password" || !payload.userId) {
      return res.status(400).json({ error: "Invalid reset token payload" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.users.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });

    return res
      .status(200)
      .json({ message: "Password reset successful. Please login." });
  } catch (error) {
    logger.error("Reset password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Request Access: send request details to admin email
const requestAccess = async (req, res) => {
  try {
    const { name, email, organization, message } = req.body;
    await emailService.sendAccessRequestEmail({
      name,
      email,
      organization,
      message,
    });
    return res.status(200).json({
      message: "Access request submitted. Administrator will contact you.",
    });
  } catch (error) {
    logger.error("Request access error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  requestAccess,
};
