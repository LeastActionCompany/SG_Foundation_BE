// routes/donationRoutes.js
const router = require("express").Router();
const {
  createOrder,
  verifyPayment,
} = require("../controllers/donationController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;