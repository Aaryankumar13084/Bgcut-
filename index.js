const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors()); // ✅ CORS Issue Fix

// ✅ Manually CORS Headers Set करो
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // ✅ सभी Origins को Allow करें
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

const PHOTO_ROOM_API_KEY = "sandbox_1c2c30c785f6672a6a8fecac1fbf2ef32a44dd04"; // 🔥 अपनी API Key डालो

app.post("/remove-bg", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        console.log("🔹 Image received, sending to PhotoRoom API...");

        const imageBuffer = req.file.buffer.toString("base64"); // ✅ Buffer को Base64 में Convert करो

        const response = await axios.post(
            "https://sdk.photoroom.com/v1/edit/remove-background",
            { image_file_b64: imageBuffer },  // ✅ Base64 में Data भेजो
            {
                headers: {
                    "X-Api-Key": PHOTO_ROOM_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ API Response Received!");

        res.set("Content-Type", "image/png");
        res.send(Buffer.from(response.data.image_base64, "base64")); // ✅ API से Base64 Image लेके Send करो
    } catch (error) {
        console.error("❌ API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Background remove failed!" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});