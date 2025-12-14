const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ===== บุคลิก AI =====
const systemPrompt = `
คุณคือ AI Assistant ภาษาไทย
พูดสุภาพ เป็นกันเอง
อธิบายเข้าใจง่าย เหมาะกับนักเรียน
`;

// ===== API แชท =====
app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages || [];

        let prompt = systemPrompt + "\n";
        for (const m of messages) {
            prompt += `${m.role}: ${m.content}\n`;
        }

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3:latest",
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();

        res.json({
            reply: data.response || "AI ไม่สามารถตอบได้"
        });

    } catch (err) {
        console.error(err);
        res.json({ reply: "เซิร์ฟเวอร์มีปัญหา" });
    }
});

// ===== เปิดเซิร์ฟเวอร์ =====
app.listen(3000, () => {
    console.log("🚀 AI Server running at http://localhost:3000");
});
