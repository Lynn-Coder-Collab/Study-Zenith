import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  // Initialize AI Clients lazily
  let genAI: any | null = null;
  const getGenAI = () => {
    if (!genAI && process.env.GEMINI_API_KEY) {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return genAI;
  };

  const getOpenAIClient = (provider: string) => {
    let apiKey = "";
    let baseURL = "";

    switch (provider) {
      case "openrouter":
        apiKey = process.env.OPENROUTER_API_KEY || "";
        baseURL = "https://openrouter.ai/api/v1";
        break;
      case "groq":
        apiKey = process.env.GROQ_API_KEY || "";
        baseURL = "https://api.groq.com/openai/v1";
        break;
      case "featherless":
        apiKey = process.env.FEATHERLESS_API_KEY || "";
        baseURL = "https://api.featherless.ai/v1";
        break;
    }

    if (!apiKey) return null;
    return new OpenAI({ apiKey, baseURL });
  };

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/ai", async (req, res) => {
    const { provider = "gemini", model, messages, systemInstruction } = req.body;

    try {
      if (provider === "gemini") {
        const client = getGenAI();
        if (!client) return res.status(500).json({ error: "Gemini API key not configured" });

        const contents = messages.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content || m.parts || "" }]
        }));

        const result = await client.models.generateContent({
          model: model || "gemini-1.5-flash",
          contents,
          config: {
            systemInstruction: systemInstruction 
          }
        });

        res.json({ content: result.text || result.response?.text() || "No response" });
      } else {
        const client = getOpenAIClient(provider);
        if (!client) return res.status(500).json({ error: `${provider} API key not configured` });

        const response = await client.chat.completions.create({
          model: model || (provider === "groq" ? "llama3-70b-8192" : "mistralai/mistral-7b-instruct"),
          messages: [
            { role: "system", content: systemInstruction },
            ...messages.map((m: any) => ({ role: m.role, content: m.content || m.parts || "" }))
          ]
        });

        res.json({ content: response.choices[0].message.content });
      }
    } catch (error: any) {
      console.error(`AI Proxy Error (${provider}):`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Socket.IO logic for Study Rooms
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.to(roomId).emit("user-joined", { userId: socket.id });
    });

    socket.on("send-message", (data) => {
      const { roomId, message, user } = data;
      io.to(roomId).emit("receive-message", { message, user, timestamp: new Date() });
    });

    socket.on("draw", (data) => {
      const { roomId, drawings } = data;
      socket.to(roomId).emit("draw-update", drawings);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
