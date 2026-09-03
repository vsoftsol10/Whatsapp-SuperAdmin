const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { updateExpiredSubscriptions } = require("./services/subscriptionExpiryService");
const { startSubscriptionExpiryJob } = require("./jobs/subscriptionExpiryJob");
dotenv.config();
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const app = express();

app.use(helmet());

// Restrict CORS to known frontend origin(s). Set FRONTEND_URL in .env for production.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://watsupad.thevsoft.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Basic brute-force protection on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window on auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const subscriptionPlanRoutes = require("./routes/subscriptionPlanRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const subscriptionReminderRoutes = require("./routes/subscriptionReminderRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const supportTicketRoutes = require("./routes/supportTicketRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const supportTicketNoteRoutes = require("./routes/supportTicketNoteRoutes");
const superAdminUpgradeRequestRoutes = require("./routes/superAdminUpgradeRequestRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const publicPlanRoutes = require("./routes/publicPlanRoutes");

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/subscription-plans", subscriptionPlanRoutes);
app.use("/api/public/plans", publicPlanRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/subscriptions", subscriptionReminderRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/support-tickets", supportTicketRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use(
  "/api/superadmin/upgrade-requests",
  superAdminUpgradeRequestRoutes
);
app.use(
  "/api/support-tickets",
  supportTicketNoteRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Super Admin Backend Running Successfully \ud83d\ude80"
  });
});

// 404 handler - must come after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler - must be the last middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await startSubscriptionExpiryJob();
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily subscription expiry check...");

  await updateExpiredSubscriptions();
});
