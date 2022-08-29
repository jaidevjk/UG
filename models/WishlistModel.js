const mongoose = require("mongoose");

const { Schema } = mongoose;

const wishlistSchema = Schema({
  productName: { type: String, required: true },
  productPrice: { type: String, required: true },
});
const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;
