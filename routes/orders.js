const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders — place a new order
router.post('/', async (req, res) => {
  try {
    const { customer, items, subtotal, deliveryCharge = 40, notes, paymentMethod } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Customer info and items are required' });
    }

    const tax = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = subtotal + deliveryCharge + tax;

    const order = await Order.create({
      customer,
      items,
      subtotal,
      deliveryCharge,
      tax,
      totalAmount,
      notes,
      paymentMethod
    });

    // Build WhatsApp message
    const itemsList = items
      .map((i) => `  • ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`)
      .join('\n');

    const waMsg = encodeURIComponent(
      `🍗 *NEW ORDER — Hungry Birds*\n\n` +
      `*Order #:* ${order.orderNumber}\n` +
      `*Name:* ${customer.name}\n` +
      `*Phone:* ${customer.phone}\n` +
      `*Address:* ${customer.address}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Subtotal:* ₹${subtotal}\n` +
      `*Delivery:* ₹${deliveryCharge}\n` +
      `*Tax (5%):* ₹${tax}\n` +
      `*TOTAL:* ₹${totalAmount}\n\n` +
      `*Payment:* ${paymentMethod || 'COD'}\n` +
      (notes ? `*Notes:* ${notes}\n` : '') +
      `\nPlease confirm this order. Thank you! 🙏`
    );

    const whatsappUrl = `https://wa.me/919069024999?text=${waMsg}`;

    res.status(201).json({
      success: true,
      data: order,
      whatsappUrl,
      message: 'Order placed successfully!'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/orders — list all orders (admin)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.phone) filter['customer.phone'] = req.query.phone;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: orders
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/orders/:id/status — admin: update status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
