const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: "GROQ_API_KEY is missing",
    });
  }

  try {
    const completion = await client.chat.completions.create(
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are MISA, a futuristic AI companion. Speak warmly and intelligently.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        timeout: 15000,
      }
    );

    const reply = completion.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "Groq did not return a reply",
      });
    }

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
