const express = require("express");
const router = express.Router();

const {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require("../controller/sweet.controller");

const auth = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/role.middleware");

// Protected routes
router.post("/", auth, isAdmin, addSweet);
router.get("/", auth, getAllSweets);
router.get("/search", auth, searchSweets);
router.put("/:id", auth, isAdmin, updateSweet);
router.delete("/:id", auth, isAdmin, deleteSweet);

// Inventory
router.post("/:id/purchase", auth, purchaseSweet);
router.post("/:id/restock", auth, isAdmin, restockSweet);

module.exports = router;
