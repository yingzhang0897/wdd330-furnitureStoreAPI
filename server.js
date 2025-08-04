const express = require("express");
const app = express();
const productRoutes = require("./routes/products"); 

app.use(express.json());
app.use("/api", productRoutes); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.use(express.json());

app.post("/get-shipping-rate", async (req, res) => {
  const { to_zip, weight, length, width, height } = req.body;
  const from_zip = "94103"; // your warehouse ZIP

  try {
    const response = await fetch("https://api.easypost.com/v2/rates", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from("YOUR_API_KEY_HERE" + ":").toString("base64")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        rate: {
          from_zip,
          to_zip,
          weight,
          length,
          width,
          height
        }
      })
    });

    const result = await response.json();
    const rate = parseFloat(result.rate.amount); // assuming API returns this

    res.json({ rate });
  } catch (error) {
    console.error("Shipping rate error:", error);
    res.status(500).json({ error: "Failed to get rate" });
  }
});
