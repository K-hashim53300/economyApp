import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    product: String,
    price: Number,
    price_change: Number,
    price_change_percent: Number
  });
export  const productModel = mongoose.model('Product',productSchema);