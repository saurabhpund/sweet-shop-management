const Sweet = require("../model/Sweet");

exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, imageUrl } = req.body;

    // Test: Validation
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      imageUrl: imageUrl || ""
    });

    return res.status(201).json(sweet);
  } catch (error) {
    return res.status(500).json({
      message: "Server error"
    });
  }
};

exports.getAllSweets = (req, res) => res.send("get sweets");
exports.searchSweets = (req, res) => res.send("search sweets");
exports.updateSweet = (req, res) => res.send("update sweet");
exports.deleteSweet = (req, res) => res.send("delete sweet");
exports.purchaseSweet = (req, res) => res.send("purchase sweet");
exports.restockSweet = (req, res) => res.send("restock sweet");
    