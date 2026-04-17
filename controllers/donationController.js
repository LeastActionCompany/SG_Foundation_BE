// controllers/donationController.js
const { razorpay, isConfigured, keyId, keySecret } = require("../config/razorpay");
const crypto = require("crypto");
const Donation = require("../models/Donation");
const sendMail = require("../config/mailer");

exports.createOrder = async (req, res) => {
  try {
    if (!isConfigured || !razorpay) {
      return res.status(503).json({
        error:
          "Donation service is not configured. Add Razorpay credentials in backend/.env.",
      });
    }

    const { amount, name, email, contact, type } = req.body;

    const orderPayload = {
      amount: amount * 100,
      currency: "INR",
    };

    // attach optional notes/meta if provided
    if (name || email || contact || type) {
      orderPayload.notes = { name, email, contact, type };
    }

    const order = await razorpay.orders.create(orderPayload);

    res.json({
      order_id: order.id,
      amount,
      key: keyId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    if (!isConfigured || !keySecret) {
      return res.status(503).json({
        error:
          "Donation service is not configured. Add Razorpay credentials in backend/.env.",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      name,
      email,
      contact,
      type,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const donation = await Donation.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount,
        status: "success",
        donorName: name || undefined,
        donorEmail: email || undefined,
        donorContact: contact || undefined,
        type: type || undefined,
      });

      await sendMail(
        "New Donation Received",
        `<h3>Donation</h3>
         <p>Amount: ₹${amount}</p>
         <p>Payment ID: ${razorpay_payment_id}</p>`
      );

      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
