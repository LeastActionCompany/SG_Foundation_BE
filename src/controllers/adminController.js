const Contact = require("../models/Contact");
const Volunteer = require("../models/Volunteer");
const Donation = require("../models/Donation");
const {
  ADMIN_USERNAME,
  TOKEN_TTL_MS,
  createAdminToken,
  isValidAdmin,
} = require("../utils/adminAuth");

exports.loginAdmin = async (req, res) => {
  try {
    const { username = "", password = "" } = req.body || {};

    if (!isValidAdmin(username, password)) {
      return res.status(401).json({ error: "Invalid admin username or password." });
    }

    const token = createAdminToken();

    res.json({
      success: true,
      token,
      expiresIn: TOKEN_TTL_MS,
      admin: {
        username: ADMIN_USERNAME,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const [contacts, volunteers, donations] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).lean(),
      Volunteer.find().sort({ createdAt: -1 }).lean(),
      Donation.find().sort({ createdAt: -1 }).lean(),
    ]);

    const successfulDonations = donations.filter(
      (donation) => donation.status === "success"
    );
    const donationTotal = successfulDonations.reduce(
      (sum, donation) => sum + (Number(donation.amount) || 0),
      0
    );

    res.json({
      success: true,
      stats: {
        totalContacts: contacts.length,
        totalVolunteers: volunteers.length,
        totalDonations: donations.length,
        successfulDonations: successfulDonations.length,
        donationTotal,
      },
      contacts,
      volunteers,
      donations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
