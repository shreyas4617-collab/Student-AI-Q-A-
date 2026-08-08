import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// System instructions adhering strictly to the user prompt rules
const SYSTEM_INSTRUCTIONS = `
You are an AI-powered Student Question & Answer Bot designed to help students learn effectively.

Your role is to provide clear, accurate, and educational answers to students' questions across multiple subjects:
Mathematics, Science, Computer Science, AI, Programming (Python, Java, C, C++, JavaScript, etc.), Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, Machine Learning, Cyber Security, English, General Knowledge.

Instructions:
1. Answer questions in a simple, student-friendly language.
2. Explain concepts step-by-step whenever possible.
3. If the question involves calculations, show the complete solution.
4. If the question is about programming:
   - Explain the logic first.
   - Provide clean, well-commented code.
   - Mention the time and space complexity when appropriate.
5. If multiple solutions exist, explain the most commonly used one first.
6. Use examples to make concepts easier to understand.
7. If the student asks for a definition, provide:
   - Definition
   - Explanation
   - Example
8. If the student asks theoretical questions, answer in an exam-friendly format with bullet points.
9. If the student asks MCQs:
   - Give the correct answer.
   - Explain why it is correct.
10. If the question is unclear, politely ask for clarification instead of guessing.
11. Never generate false or misleading information. If you are unsure, clearly state your uncertainty.
12. Encourage learning rather than simply giving answers.
13. Keep responses concise unless the student requests a detailed explanation.
14. Maintain a polite, friendly, and professional tone.
15. Format responses using headings, bullet points, tables, and code blocks where appropriate.
16. Avoid offensive, harmful, or inappropriate content.
17. If the question is outside academics, answer briefly and redirect the conversation toward educational topics if appropriate.

IMPORTANT RESPONSE FORMAT:
Always format your response using standard markdown headings so students can easily scan and digest it.

When appropriate, include the following clear structure:

### Question:
[Restate or summarize the student's question clearly]

### Answer:
[Provide the primary explanation clearly and concisely]

### Example:
[Provide a clear, illustrative example]

### Key Points:
• Point 1
• Point 2
• Point 3

---

IF THE QUESTION IS ABOUT PROGRAMMING:
### Algorithm / Logic:
[Step-by-step logic breakdown]

### Code:
\`\`\`[language]
[Clean, well-commented code]
\`\`\`

### Expected Output:
\`\`\`
[Sample output]
\`\`\`

### Time & Space Complexity:
• **Time Complexity:** O(...) - explanation
• **Space Complexity:** O(...) - explanation

---

IF THE QUESTION IS ABOUT MATHEMATICS:
### Formula:
[Key formulas used]

### Step-by-Step Solution:
[Detailed mathematical steps]

### Final Answer:
[Highlighted final answer]

---

IF THE QUESTION IS AN MCQ:
### Correct Answer:
[Selected Option and Answer]

### Explanation:
[Why this option is correct and why other options are incorrect]
`;

// Endpoint 1: Ask Q&A Endpoint
app.post("/api/qa/ask", async (req, res) => {
  try {
    const { question, subject, mode, imageBase64, mimeType } = req.body;

    if (!question && !imageBase64) {
      return res.status(400).json({ error: "Please provide a question or an image of your textbook problem." });
    }

    const contentsParts: any[] = [];

    if (imageBase64) {
      contentsParts.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: imageBase64,
        },
      });
    }

    let userPromptText = `Subject context: ${subject || "General"}\nMode preference: ${mode || "standard"}\nStudent Question: ${question || "Please analyze and solve the question/equation in the attached image."}`;

    contentsParts.push({ text: userPromptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contentsParts.length === 1 ? userPromptText : { parts: contentsParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.3,
      },
    });

    const text = response.text || "Sorry, I could not generate an answer at this time. Please try rephrasing your question.";

    return res.json({
      answer: text,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Error generating Q&A answer:", err);
    return res.status(500).json({
      error: err?.message || "Failed to generate answer. Please check process logs or API credentials.",
    });
  }
});

// Endpoint 2: Generate Interactive Quiz MCQs
app.post("/api/qa/quiz", async (req, res) => {
  try {
    const { topic, subject, count = 5 } = req.body;

    const quizPrompt = `Generate a ${count}-question multiple-choice quiz for students on the topic: "${topic || "General Concepts"}" under the subject "${subject || "Computer Science"}".
Make questions exam-relevant, clear, and educational.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: quizPrompt,
      config: {
        systemInstruction: "You are an expert exam question generator for students. Output valid JSON array of quiz objects.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of exactly 4 options",
              },
              correctOptionIndex: { type: Type.INTEGER, description: "0-based index of correct option" },
              explanation: { type: Type.STRING, description: "Detailed explanation why it is correct" },
              topic: { type: Type.STRING },
            },
            required: ["id", "question", "options", "correctOptionIndex", "explanation"],
          },
        },
      },
    });

    const quizData = JSON.parse(response.text || "[]");
    return res.json({ quiz: quizData });
  } catch (err: any) {
    console.error("Quiz generation error:", err);
    return res.status(500).json({ error: "Failed to generate quiz. " + (err.message || "") });
  }
});

// Endpoint 3: Generate Flashcards
app.post("/api/qa/flashcards", async (req, res) => {
  try {
    const { topic, subject, count = 6 } = req.body;

    const fcPrompt = `Create ${count} flashcards for students reviewing the topic "${topic || "Key Concepts"}" in "${subject || "General"}". Each flashcard should have a question/term on the front and a concise explanation/definition with example on the back.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fcPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              front: { type: Type.STRING, description: "Concept / Term / Question" },
              back: { type: Type.STRING, description: "Explanation / Answer / Key Example" },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ["id", "front", "back"],
          },
        },
      },
    });

    const cards = JSON.parse(response.text || "[]");
    return res.json({ flashcards: cards });
  } catch (err: any) {
    console.error("Flashcards error:", err);
    return res.status(500).json({ error: "Failed to generate flashcards." });
  }
});

// Start express server and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Student Q&A AI Bot Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
