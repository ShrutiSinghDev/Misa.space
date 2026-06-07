import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

dotenv.config({
  path: join(__dirname, ".env")
});

console.log("Groq key loaded:", !!process.env.GROQ_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(projectRoot));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/chat", async (req, res) => {

  console.log("CHAT REQUEST RECEIVED");
  console.log(req.body);
  console.log("User message:", req.body.message);

  try {

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY is missing"
      });
    }

    const completion =
      await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are MISA, a futuristic AI companion. Speak warmly and intelligently."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      }, {
        timeout: 15000
      });

    const reply =
      completion.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "Groq did not return a reply"
      });
    }

    res.json({
      reply
    });

  } catch(error){

  console.error("FULL ERROR:");
  console.error(error);

  console.error("MESSAGE:");
  console.error(error.message);

  console.error("STATUS:");
  console.error(error.status);

  res.status(500).json({
    reply: error.message
  });

}

});
app.listen(3000, () => {

  console.log(
    "MISA AI running on port 3000"
  );

});
