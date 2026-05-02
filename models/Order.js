const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true
    },
    customer: {
      name: { type: String, required: [true, 'Customer name is required'], trim: true },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
      },
      address: { type: String, required: [true, 'Delivery address is required'], trim: true }
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item'
      }
    },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 40 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD'
    },
    notes: { type: String, trim: true, maxlength: 500 },
    whatsappSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `HB${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

// Index for quick lookups
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
