const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataFile = path.join(__dirname, "../data/products.json");

// Read product data
function getProducts() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// GET all products
router.get("/", (req, res) => {
  const products = getProducts();
  res.json(products);
});

// GET product by ID
router.get("/:id", (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({ error: "Product not found" });
});

// POST new product
router.post("/", (req, res) => {
  const products = getProducts();
  const newProduct = req.body;
  products.push(newProduct);
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// PUT update product
router.put("/:id", (req, res) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
  res.json(products[index]);
});

// DELETE product
router.delete("/:id", (req, res) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== req.params.id);
  fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2));
  res.status(204).end();
});

module.exports = router;
