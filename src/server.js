const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Proxy route
app.get("/proxy/codes", async (req, res) => {
    try {
        const response = await axios.get("http://176.123.9.60:3000/v1/codes");
        res.json(response.data);
    } catch (error) {
        console.error("Error proxying request:", error);
        res.status(500).json({ error: "Error proxying request" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
