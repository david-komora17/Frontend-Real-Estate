import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Different prompt templates for different use cases
export const enhanceDescription = async (title, location, additionalDetails = {}) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Build a rich prompt with specific requirements
        let prompt = `You are a professional luxury real estate copywriter in Nairobi, Kenya. 
Write a compelling, detailed property description for:

PROPERTY TITLE: "${title}"
LOCATION: ${location}
${additionalDetails.bedrooms ? `BEDROOMS: ${additionalDetails.bedrooms}` : ''}
${additionalDetails.price ? `PRICE: KES ${additionalDetails.price}/month` : ''}
${additionalDetails.type ? `PROPERTY TYPE: ${additionalDetails.type}` : ''}

REQUIREMENTS:
- Write exactly 3-4 sentences (60-80 words)
- Include specific details about the location's prestige
- Mention nearby amenities (shopping malls, schools, restaurants, parks)
- Use luxury adjectives but keep it professional
- End with a call-to-action for booking a viewing

DESCRIPTION:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up the response
        text = text.replace(/^DESCRIPTION:\s*/i, '');
        text = text.trim();
        
        return text;
        
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback description if API fails
        return `Experience luxury living at ${title} in prestigious ${location}. This exquisite property offers modern finishes and breathtaking views. Contact us today to schedule a private viewing of this remarkable home.`;
    }
};

// New function: Generate SEO-optimized property title
export const generatePropertyTitle = async (location, type, bedrooms) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate a catchy, SEO-friendly real estate listing title for a ${bedrooms}-bedroom ${type} in ${location}, Nairobi. 
The title should be under 60 characters and sound premium. Examples: "Skyline Haven - Westlands" or "The Pinnacle - Runda"
Return ONLY the title, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Title generation failed:", error);
        return `${bedrooms} Bedroom ${type} in ${location}`;
    }
};

// New function: Extract location insights
export const getLocationInsights = async (location) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Provide 2-3 notable landmarks or amenities near ${location}, Nairobi. 
Format as a comma-separated list. Example: "near Village Market, close to international schools, 5 mins from UN offices"
Keep it under 100 characters.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Location insights failed:", error);
        return "prime location with easy access to amenities";
    }
};

// New function: Generate bullet points for property features
export const generateFeatures = async (type, bedrooms, bathrooms) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate 4 bullet points of key features for a ${bedrooms}-bedroom, ${bathrooms}-bathroom ${type} in Nairobi.
Format each bullet point with a ✅ emoji at the start. Keep each point under 50 characters.
Example:
✅ Spacious open-plan living
✅ Private parking included
✅ 24/7 security system
✅ Modern fitted kitchen`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim().split('\n').filter(line => line.trim());
    } catch (error) {
        console.error("Features generation failed:", error);
        return [
            "✅ Spacious living area",
            "✅ Modern kitchen",
            "✅ Secure neighborhood",
            "✅ Close to amenities"
        ];
    }
};