// src/app.js - Express app setup
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/volunteer", require("./routes/volunteerRoutes"));
app.use("/api/donation", require("./routes/donationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

module.exports = app;
