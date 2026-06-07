const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const getAIResponse = async (message) => {
  const completion = await client.chat.completions.create({
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
  });

  return completion.choices?.[0]?.message?.content || "";
};

module.exports = { getAIResponse };
