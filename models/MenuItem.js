const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Starters', 'Biryani', 'Tandoori', 'Main Course', 'Beverages'],
        message: 'Category must be one of: Starters, Biryani, Tandoori, Main Course, Beverages'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least ₹1']
    },
    image: {
      type: String,
      required: [true, 'Image URL is required']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters']
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      default: 'Medium'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ isPopular: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);



