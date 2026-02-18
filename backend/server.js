import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// const openAI = require('openai');
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Open AI not available for free to use, so go for gemini instead, which is free to use and has similar capabilities.
// const openai = new openAI.OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // optional but safer
});

// chat Endpoints
app.post('/api/chat', async (req, res) => {
  try {
      const { message } = req.body;
      if(!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                role: "user",
                parts: [{ text: message }],
                },
            ],
        });

        // const response = await openai.responses.create({
        // model: "gpt-4o-mini",
        // input: [
        //     { role: "system", content: "You are a helpful assistant." },
        //     { role: "user", content: message}
        // ],
        // });
        // res.json({ message: response.output_text });
        const text = response.text;

        res.json({ message: text });

  } catch (error) {
        console.error("Gemini Error:", error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
  }

});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json('Something went wrong!');

});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});