const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",     
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api", require("./routes/products"));
app.use("/api/shipping", require("./routes/shipping"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

