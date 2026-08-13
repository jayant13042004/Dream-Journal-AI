import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

console.log("API key loaded:", !!apiKey);
console.log("API key prefix:", apiKey?.slice(0, 3));

const ai = new GoogleGenAI({
  apiKey,
});

try {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Say hello in one sentence.",
  });

  console.log("SUCCESS:");
  console.log(response.text);
} catch (error) {
  console.error("FAILED:");
  console.error(error);
}