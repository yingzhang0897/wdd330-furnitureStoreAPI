const express = require("express");
const cors = require("cors");

const app = express();

//Allow all origins (works only if client does NOT send cookies)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.options("*", cors());

app.use(express.json());

// Your routes
app.use("/api", require("./routes/products"));          
app.use("/api/shipping", require("./routes/shipping")); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
