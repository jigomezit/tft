const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const RIOT_API_KEY = process.env.RIOT_API_KEY || "RGAPI-bc40386d-2f0e-48d3-a57b-a11ec26578ae";

app.use(cors());
app.use(express.json());

// ── Proxy hacia Riot API ──────────────────────────────────────────────────────
app.get("/api/riot/*", async (req, res) => {
  const riotPath = req.params[0];
  const query = new URLSearchParams(req.query).toString();
  const url = `https://${riotPath}${query ? "?" + query : ""}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Servir React en producción ────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ TFT Coach server corriendo en puerto ${PORT}`);
});
