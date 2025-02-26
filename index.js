const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 5000; // 🚀 Railway के लिए PORT

app.use(cors()); // 🚀 CORS Error Fix
const upload = multer({ storage: multer.memoryStorage() });

const ZYRO_API_URL = "https://api.zyro.com/v1/remove-bg"; // 🔥 Zyro API URL

// 🚀 Remove Background API (Zyro API)
app.post("/remove-bg", upload.single("image_file"), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append("image_file", req.file.buffer, "image.png");

        const response = await axios.post(ZYRO_API_URL, formData, {
            headers: formData.getHeaders(),
            responseType: "arraybuffer",
        });

        const imageBuffer = Buffer.from(response.data, "binary");
        const base64Image = imageBuffer.toString("base64");

        res.json({
            success: true,
            message: "Background removed successfully!",
            image: `data:image/png;base64,${base64Image}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing image",
            error: error.response?.data || error.message
        });
    }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

