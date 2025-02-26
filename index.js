const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ CORS Issue Fix
app.use(cors({ origin: "*" })); // सभी Domains को Allow करें

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // ✅ सभी Origins को Allow करें
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.options("*", (req, res) => {
    res.sendStatus(200);
});

const PHOTO_ROOM_API_KEY = "sandbox_1c2c30c785f6672a6a8fecac1fbf2ef32a44dd04"; // 🔥 API Key

app.get("/", (req, res) => {
    res.send("✅ BGCut API is running...");
});

app.post("/remove-bg", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        console.log("🔹 Image received, sending to PhotoRoom API...");

        const response = await axios.post(
            "https://sdk.photoroom.com/v1/edit/remove-background",
            req.file.buffer,
            {
                headers: {
                    "X-Api-Key": PHOTO_ROOM_API_KEY,
                    "Content-Type": "image/png"
                },
                responseType: "arraybuffer"
            }
        );

        console.log("✅ API Response Received!");

        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        console.error("❌ API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Background remove failed!" });
    }
});

// ✅ Port Fix
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});