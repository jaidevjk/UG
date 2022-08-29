const express = require("express");
const {
  createWishlist,
  fetchWishlist,
  deleteWishlist,
} = require("../controllers/WishListController");

const auth = require("../middleware/auth.js");
const { route } = require("./AddressRoutes");

const router = express.Router();

router.post("/", createWishlist);
router.get("/", fetchWishlist);
router.get("/:id", auth, deleteWishlist);

module.exports = router;
