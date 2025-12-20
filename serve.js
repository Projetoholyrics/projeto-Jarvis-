import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ COLOQUE SUA CHAVE AQUI
const API_KEY = "SUA_CHAVE_DE_IA_AQUI";

app.post("/ia", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Você é o JARVIS do Davi. Seja educado, futurista e direto."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.json({ reply: "Erro ao acessar a inteligência artificial." });
  }
});

app.listen(3000, () => {
  console.log("🧠 JARVIS IA online em http://localhost:3000");
});
