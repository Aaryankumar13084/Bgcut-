const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors()); // 🔥 CORS Error हटाने के लिए

const PHOTO_ROOM_API_KEY = "sandbox_1c2c30c785f6672a6a8fecac1fbf2ef32a44dd04"; // 🔥 अपनी PhotoRoom API Key डालो

app.post("/remove-bg", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

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

        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: "Background remove failed!" });
    }
});

// 🚀 Server Start करो
app.listen(5000, () => console.log("✅ Server is running on http://localhost:5000"));