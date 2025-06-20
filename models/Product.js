const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: String,
  price: Number,
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
