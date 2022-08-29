const Wishlist = require("../models/WishlistModel.js");
const mongoose = require("mongoose");

exports.createWishlist = async (req, res) => {
  const wishlist = req.body;
  const newWishlist = new Wishlist(wishlist);
  try {
    await newWishlist.save();
    res.status(201).json(newWishlist);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in creating new Wishlist");
  }
};
exports.fetchWishlist = async (req, res) => {
  const wishlist = await Wishlist.find();
  try {
    res.status(200).send(wishlist);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Wishlist");
  }
};
exports.deleteWishlist = async (req, res) => {
  const id = req.params.id;
  try {
    await Address.findByIdAndRemove(id);
    res.send("User Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
};
