const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors()); // ✅ Basic CORS Fix

// ✅ Custom CORS Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // सभी Origins को Allow करें
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    
    next();
});

// ✅ Background Remove API (फिक्स किया गया)
app.post("/remove-bg", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        console.log("🔹 Image received, sending to API...");

        const response = await fetch("https://sdk.photoroom.com/v1/edit/remove-background", {
            method: "POST",
            headers: {
                "X-Api-Key": "sandbox_1c2c30c785f6672a6a8fecac1fbf2ef32a44dd04",
                "Content-Type": "image/png",
            },
            body: req.file.buffer,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        res.set("Content-Type", "image/png");
        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: "Background remove failed!" });
    }
});

app.listen(8080, () => console.log("✅ Server running on port 8080"));