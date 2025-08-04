const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

function readJsonFile(filename) {
  const filePath = path.join(__dirname, "../data", filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

function getProducts() {
  const sofas = readJsonFile("sofas.json");
  const beds = readJsonFile("beds-mattresses.json");
  const tables = readJsonFile("tables-chairs.json");
  const kids = readJsonFile("baby-kids.json");

  return [...sofas, ...beds, ...tables, ...kids];
}

router.get("/products/category/:category", (req, res) => {
  const category = req.params.category;
  const fileMap = {
    sofas: "sofas.json",
    beds: "beds-mattresses.json",
    tables: "tables-chairs.json",
    kids: "baby-kids.json"
  };

  const filename = fileMap[category];
  if (!filename) {
    return res.status(404).json({ error: "Category not found" });
  }

  try {
    const products = readJsonFile(filename);
    res.json(products);
  } catch (err) {
    console.error("Failed to load category data:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
