// controllers/volunteerController.js
const Volunteer = require("../models/Volunteer");
const sendMail = require("../config/mailer");

exports.submitVolunteer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const volunteer = await Volunteer.create({ name, email, phone });

    res.json({ success: true, volunteer });

    sendMail(
      "New Volunteer Registration",
      `<h3>Volunteer</h3>
       <p>Name: ${name}</p>
       <p>Email: ${email}</p>
       <p>Phone: ${phone}</p>`
    ).catch((mailError) => {
      console.error("Volunteer email send failed:", mailError.message);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
