// routes/volunteerRoutes.js
const router = require("express").Router();
const { submitVolunteer } = require("../controllers/volunteerController");

router.post("/", submitVolunteer);

module.exports = router;