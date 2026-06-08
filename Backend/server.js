import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
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

const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.get("/chat/history", async (req, res) => {

  const userEmail =
    normalizeEmail(req.query.email);

  if (!userEmail) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  if (!supabase) {
    return res.json({
      messages: []
    });
  }

  try {

    const { data, error } =
      await supabase
        .from("chat_messages")
        .select("role, content, created_at")
        .eq("user_email", userEmail)
        .order("created_at", {
          ascending: true
        })
        .limit(100);

    if (error) {
      throw error;
    }

    res.json({
      messages: data || []
    });

  } catch (error) {

    console.error("CHAT HISTORY ERROR:");
    console.error(error);

    res.status(500).json({
      error: "Could not load chat history"
    });

  }

});

app.post("/chat", async (req, res) => {

  console.log("CHAT REQUEST RECEIVED");
  console.log(req.body);
  console.log("User message:", req.body.message);

  try {

    const userMessage =
      req.body.message;

    const userEmail =
      normalizeEmail(req.body.email);

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

    if (userEmail) {
      await saveChatMessage(
        userEmail,
        "user",
        userMessage
      );
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

    if (userEmail) {
      await saveChatMessage(
        userEmail,
        "ai",
        reply
      );
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

async function saveChatMessage(userEmail, role, content) {

  if (!supabase) return;

  const { error } =
    await supabase
      .from("chat_messages")
      .insert({
        user_email: userEmail,
        role,
        content
      });

  if (error) {
    console.error("CHAT SAVE ERROR:");
    console.error(error);
  }

}

function normalizeEmail(email) {

  if (typeof email !== "string") {
    return "";
  }

  return email
    .trim()
    .toLowerCase();

}

app.listen(3000, () => {

  console.log(
    "MISA AI running on port 3000"
  );

});
