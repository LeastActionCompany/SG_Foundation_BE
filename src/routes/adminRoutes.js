const router = require("express").Router();
const { loginAdmin, getDashboardData } = require("../controllers/adminController");
const requireAdmin = require("../middleware/requireAdmin");

router.post("/login", loginAdmin);
router.get("/dashboard", requireAdmin, getDashboardData);

module.exports = router;
