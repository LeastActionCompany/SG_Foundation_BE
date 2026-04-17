// controllers/contactController.js
const Contact = require ("../models/Contact")
const sendMail = require("../config/mailer");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({ name, email, message });

    await sendMail(
      "New Contact Message",
      `<h3>New Contact</h3>
       <p>Name: ${name}</p>
       <p>Email: ${email}</p>
       <p>Message: ${message}</p>`
    );

    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};