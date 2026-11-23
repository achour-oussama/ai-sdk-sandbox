import { googleApiKey } from "./config.js";
import express from "express";
import { generateText, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { SYSTEM_PROMPT } from "./system-prompt.js";
import { getFacturation } from "./tools.js";

const app = express();
const google = createGoogleGenerativeAI({ apiKey: googleApiKey });

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Message invalide",
    });
  }

  try {
    const result = await generateText({
      model: google("gemini-3.5-flash-lite"),
      system: SYSTEM_PROMPT,
      prompt: message,

      tools: {
        "get-facturation": getFacturation,
      },

      stopWhen: stepCountIs(3),
    });

    res.json({
      response: result.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
