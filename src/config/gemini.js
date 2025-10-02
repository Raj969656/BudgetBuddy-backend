import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_API_KEY = "AIzaSyA2l76nvKVWloPSSizbJRjS1JZhEnVm9tY";

const genAiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
console.log("\n\nGemini Client Initialized:", genAiClient);

/**
 * Sends a text prompt to the Gemini model and returns the generated content.
 * @param {string} prompt The text prompt to send to the model.
 * @returns {Promise<string>} A promise that resolves with the generated text.
 */
export const generateContentFromGemini = async (prompt) => {
  try {
    // For a list of available models, see the documentation:
    // https://ai.google.dev/models/gemini
    const model = genAiClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    // You can return a user-friendly error message or re-throw the error
    // depending on your application's needs.
    return "Failed to get a response from the AI. Please try again.";
  }
};
export default genAiClient;
