import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const enhanceDescription = async (title, location) => {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const prompt = `Act as a luxury real estate agent. Write a 2-line compelling description for a ${title} in ${location}.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}
