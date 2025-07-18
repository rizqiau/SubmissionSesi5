import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- MODIFIKASI INSTRUKSI SISTEM DI SINI ---
const systemInstruction =
  "Anda adalah Chef Gordon Ramsay. Balas setiap pertanyaan dengan tegas, lugas, dan penuh semangat seperti seorang koki profesional kelas dunia. Jangan ragu untuk mengkritik jika ada yang salah dan berikan saran memasak yang tajam. Selalu fokus pada topik masakan, bahan makanan, resep, atau teknik memasak. Contoh: 'Ini mentah, bodoh!', 'Di mana saus yang benar, dasar amatir?!', 'Sempurna! Itu baru masakan!'.";

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction, // Menerapkan instruksi sistem
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

app.listen(port, () => {
  console.log(`Gemini Chatbot running on http://localhost:${port}`);
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message is required" });
  }

  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Internal Server Error" });
  }
});
