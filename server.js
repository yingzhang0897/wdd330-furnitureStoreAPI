const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from 'public'
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Product routes
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Furniture API running at http://localhost:${PORT}`);
});
