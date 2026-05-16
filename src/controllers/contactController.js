// controllers/contactController.js
const Contact = require ("../models/Contact")
const sendMail = require("../config/mailer");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({ name, email, message });

    res.json({ success: true, contact });

    sendMail(
      "New Contact Message",
      `<h3>New Contact</h3>
       <p>Name: ${name}</p>
       <p>Email: ${email}</p>
       <p>Message: ${message}</p>`
    ).catch((mailError) => {
      console.error("Contact email send failed:", mailError.message);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
