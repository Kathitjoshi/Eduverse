import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Helper to load Gemini SDK client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined.");
    }
    // Correct named-parameter instantiation
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_IF_BLANK",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// REST API routes first

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// AI Tutor chat proxy
app.post("/api/tutor/chat", async (req, res) => {
  const { message, history, subject } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return res.status(500).json({
      error: "Gemini API Key is missing or invalid. Please check your Settings > Secrets panel in AI Studio or verify that GEMINI_API_KEY is configured in your global variables.",
      needsKeyConfig: true
    });
  }

  try {
    const ai = getGeminiClient();

    // Map the context instructions based on chosen educational subject
    const systemPrompt = `You are "EduVerse Tutor", a brilliant, supportive, and adaptive AI personal tutor.
The user is currently studying the subject: "${subject || "General Science & Humanities"}".
Follow these teaching principles:
1. Explain complex topics using simple, intuitive, relatable real-world analogies.
2. Structure your response using markdown with bold headings and clean lists.
3. Keep answers compact, digestible, and highly educational.
4. If equations are relevant, use well-formed inline symbols or clear formulas.
5. Emphasize a constructive feedback tone. Encourage the student!`;

    // Process chat history into parts or simply feed as chat context
    // We can use sending standard multi-turn content or a flat single-prompt with context
    // The @google/genai SDK can use chats.create or generateContent with structural contents.
    // Let's pass structured standard historical messages to maintain conversational flow.
    const contents: any[] = [];
    
    // Convert incoming history items to correct structure
    if (history && Array.isArray(history)) {
      history.slice(-8).forEach((h: any) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    // Safely retrieve the text output using response.text property (not a function)
    const textOutput = response.text || "I was unable to synthesize an answer. Please try rephrasing your topic!";
    return res.json({ text: textOutput });

  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while calling the Gemini API. Please review backend logs for resolution.",
      rawError: error
    });
  }
});

// Image scan & Note breakdown endpoint (Snap & Understand)
app.post("/api/snap/analyze", async (req, res) => {
  const { notesText, imageData, imageName } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Provide a beautiful responsive mock payload so that the app CAN work gracefully even if the user
    // hasn't fully set up their API key yet locally! (Excellent Developer Experience)
    return res.json({
      isDemoMode: true,
      summary: "Showing premium live demo breakdown. Configured GEMINI_API_KEY in backend will fetch real-time AI responses!\n\nThis paper discusses Backpropagation and Gradient Descent. It explains how multi-layer perceptrons calculate error vectors through derivative chains to fine-tune weights dynamically.",
      concepts: [
        "Backpropagation",
        "Gradient Descent",
        "Chain Rule",
        "Loss Landscape",
        "Learning Rate Adjustments"
      ],
      explanations: [
        {
          concept: "Chain Rule Derivatives",
          details: "Calculates the gradient of the error function with respect to each individual weight by multiplying partial derivatives from the output layers back to the input nodes."
        },
        {
          concept: "Loss Landscape",
          details: "A high-dimensional surface where height represents system error. Learning is like guided navigation to seek the deepest valley (local/global minimum)."
        },
        {
          concept: "Gradient Descent Step",
          details: "Weights are adjusted in opposition to the positive gradient vector: W_new = W_old - (LearningRate * Derivative)."
        }
      ],
      flashcards: [
        {
          id: "fc_demo_1",
          question: "What is Backpropagation primarily used for in Neural Networks?",
          answer: "To calculate gradient values of the loss function with respect to network weights, by applying the mathematical chain rule layer-by-layer.",
          subject: "Machine Learning Theory"
        },
        {
          id: "fc_demo_2",
          question: "Why is an excessively high learning rate problematic in gradient descent?",
          answer: "It can cause the optimizer to overshoot local minima recursively, leading to divergent behaviour instead of minimizing training error.",
          subject: "Machine Learning Theory"
        },
        {
          id: "fc_demo_3",
          question: "How does the 'Chain Rule' assist deep models in learning features?",
          answer: "It decomposes complex composite derivative functions into local sub-calculations, passing the back-propagated error signal correctly to earlier hidden nodes.",
          subject: "Machine Learning Theory"
        }
      ]
    });
  }

  try {
    const ai = getGeminiClient();

    let aiPrompt = `Examine the following note text or note diagram reference and generate a comprehensive structural mapping for an interactive study deck.
Note Text content:
"${notesText || "Handwritten diagrams illustrating Neural Network Derivatives, Gradient step sizes, and Chain rules across back-propagation loops."}"

You must output a highly granular JSON response. Use the exact Schema:
{
  "summary": "overall concise summary explaining what these notes are about in detail",
  "concepts": ["List of 3 to 5 core concept titles discovered"],
  "explanations": [
    { "concept": "Concept Title", "details": "simple clear explanations of how it works" }
  ],
  "flashcards": [
    { "question": "direct concise conceptual question", "answer": "precise factual answer explaining it", "category": "General study" }
  ]
}

Ensure the output is valid JSON.`;

    const contentsPayload: any[] = [];

    // If base64 image data is provided, bundle it as inlineData
    if (imageData && imageData.includes("base64,")) {
      const parts = imageData.split("base64,");
      const mime = parts[0].split(":")[1].split(";")[0];
      const base64Data = parts[1];

      contentsPayload.push({
        inlineData: {
          mimeType: mime,
          data: base64Data
        }
      });
    }

    contentsPayload.push({
      text: aiPrompt
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: contentsPayload },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            concepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            explanations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concept: { type: Type.STRING },
                  details: { type: Type.STRING }
                },
                required: ["concept", "details"]
              }
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["question", "answer", "category"]
              }
            }
          },
          required: ["summary", "concepts", "explanations", "flashcards"]
        },
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response string fetched from Gemini model.");
    }

    const payload = JSON.parse(responseText.trim());
    return res.json({
      isDemoMode: false,
      summary: payload.summary,
      concepts: payload.concepts,
      explanations: payload.explanations,
      flashcards: payload.flashcards.map((f: any, idx: number) => ({
        id: `fc_gen_${Date.now()}_${idx}`,
        question: f.question,
        answer: f.answer,
        subject: f.category || "Extracted Notes"
      }))
    });

  } catch (error: any) {
    console.error("Gemini Snap API Error:", error);
    return res.status(500).json({
      error: "Failed to process notes document via Gemini parser. " + (error.message || ""),
      rawError: error
    });
  }
});


// Production deployment static folder service and Vite Dev handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Starting development server with Vite middleware...");
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Serving production built static assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`EduVerse Platform Running at http://localhost:${PORT}/`);
    console.log(`EduVerse Platform Running at Host 0.0.0.0:${PORT}`);
    console.log(`===============================================`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
