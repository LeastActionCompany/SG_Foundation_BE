// controllers/volunteerController.js
const Volunteer = require("../models/Volunteer");
const sendMail = require("../config/mailer");

exports.submitVolunteer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const volunteer = await Volunteer.create({ name, email, phone });

    await sendMail(
      "New Volunteer Registration",
      `<h3>Volunteer</h3>
       <p>Name: ${name}</p>
       <p>Email: ${email}</p>
       <p>Phone: ${phone}</p>`
    );

    res.json({ success: true, volunteer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};