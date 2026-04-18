// models/Donation.js
const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    orderId: String,
    paymentId: String,
    amount: Number,
    status: String,
    donorName: String,
    donorEmail: String,
    donorContact: String,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", DonationSchema);