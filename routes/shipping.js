// routes/shipping-default.js (CommonJS)
const express = require("express");
const router = express.Router();

const SHIPPO_TOKEN = process.env.SHIPPO_API_TOKEN;

//Hardcode a FROM address
const FROM_ADDRESS = {
  name: "Jianjun Furniture Warehouse",
  street1: "123 Warehouse Way",
  city: "Vancouver",
  state: "WA",
  zip: "98660",
  country: "US",
  phone: "4155550000",
  email: "support@jianjunfurniture.com"
};

// Use ONE default parcel for all rating requests
const DEFAULT_PARCEL = {
  length: "24",
  width: "18",
  height: "12",
  distance_unit: "in",
  weight: "350",      // 350 oz ≈ 21.9 lb
  mass_unit: "oz"
};

// call Shippo
async function shippo(path, options = {}) {
  const resp = await fetch(`https://api.goshippo.com${path}`, {
    ...options,
    headers: {
      Authorization: `ShippoToken ${SHIPPO_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const status = data?.status || resp.status;
    throw { status, data };
  }
  return data;
}

/**
 * POST /api/shipping/rates
 * Body: { to: { name, street1, city, state, zip, country, phone?, email? } }
 * Uses FROM_ADDRESS + DEFAULT_PARCEL
 */
router.post("/rates", async (req, res) => {
  try {
    const { to } = req.body || {};
    if (!to?.street1 || !to?.city || !to?.state || !to?.zip || !to?.country) {
      return res.status(400).json({ error: "Missing destination address fields." });
    }

    const shipment = await shippo("/shipments/", {
      method: "POST",
      body: JSON.stringify({
        address_to: to,
        address_from: FROM_ADDRESS,
        parcels: [DEFAULT_PARCEL],
      }),
    });

    const rates = (shipment.rates || []).map((r) => ({
      object_id: r.object_id,
      amount: r.amount,
      currency: r.currency,
      provider: r.provider,
      servicelevel_name: r.servicelevel?.name || r.servicelevel_name,
      estimated_days: r.estimated_days,
    }));

    res.json({ rates });
  } catch (err) {
    res.status(err.status || 500).json(err.data || { error: "Shippo error" });
  }
});

module.exports = router;
