import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const enhanceDescription = async (title, location) => {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

    const prompt = `Ask anything!`;
    const result = await model.generateContent(prompt)

    const response = await result.response;
    return response.text();
}