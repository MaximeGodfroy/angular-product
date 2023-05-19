const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: { type: Number, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    inventoryStatus: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    rating: { type: Number }
  });

  module.exports = mongoose.model('Product', productSchema);