// src/utils/imageUtils.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
let genAI;
let model;

const placeholderBaseUrl = "https://placehold.co";

if (apiKey && apiKey !== "YOUR_GOOGLE_GEMINI_API_KEY_HERE" && apiKey.length > 10) {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });
  console.log("Gemini AI Model initialized for image utilities.");
} else {
  console.error(
    "VITE_GOOGLE_GEMINI_AI_API_KEY is not set correctly or is a placeholder. " +
    "Image fetching will use placeholders. Please check your .env file."
  );
  // Mock model to prevent crashes if API key is missing or invalid
  model = {
    generateContent: async (promptRequest) => {
      const promptText = promptRequest.contents[0].parts[0].text; // Accessing the prompt text
      console.warn("AI Model (imageUtils): API Key missing/invalid. Returning mock response for prompt:", promptText);
      let mockResponseText = "{}"; 
      const destinationName = promptText.match(/"([^"]+), India"/) ? promptText.match(/"([^"]+), India"/)[1] : "Image";

      if (promptText.includes("single, high-quality, visually stunning, landscape-oriented image URL")) {
        mockResponseText = JSON.stringify({ imageUrl: `${placeholderBaseUrl}/1600x900/777/FFF?text=${encodeURIComponent(destinationName)}+AI+Key+Error&font=playfairdisplay` });
      } else if (promptText.includes("JSON array of")) {
        const countMatch = promptText.match(/JSON array of exactly (\d+)/);
        const count = countMatch ? parseInt(countMatch[1], 10) : 1;
        const mockImages = Array(count).fill(null).map((_, i) => ({
            url: `${placeholderBaseUrl}/600x400/777/FFF?text=${encodeURIComponent(destinationName)}+${i+1}+AI+Key+Error&font=lato`, 
            alt: `AI Service Error - Image ${i+1} for ${destinationName}`
        }));
        mockResponseText = JSON.stringify(mockImages);
      }
      return { response: { text: () => mockResponseText, candidates: [{ content: { parts: [{text: mockResponseText}]}}] } }; // Mocking candidate structure
    }
  };
}

const cleanAndExtractJson = (responseText) => {
    if (!responseText || typeof responseText !== 'string') return null;
    const markdownJsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownJsonMatch && markdownJsonMatch[1]) return markdownJsonMatch[1].trim();
    const looseJsonMatch = responseText.match(/(\[[\s\S]*\]|\{[\s\S]*\})(?:\s*;?\s*$)?/); // Allow optional semicolon at the end
    if (looseJsonMatch && looseJsonMatch[0]) return looseJsonMatch[0].trim();
    if ((responseText.trim().startsWith("{") && responseText.trim().endsWith("}")) || (responseText.trim().startsWith("[") && responseText.trim().endsWith("]"))) {
        return responseText.trim();
    }
    console.warn("Could not confidently extract JSON from response:", responseText);
    return null; 
};

export const fetchDestinationHeroImage = async (destination) => {
  const defaultImageUrl = `${placeholderBaseUrl}/1600x900/AAB8C2/FFF?text=${encodeURIComponent(destination || 'Destination')}+Image+Unavailable&font=playfairdisplay`;
  if (!destination) {
    console.warn("fetchDestinationHeroImage: No destination provided.");
    return defaultImageUrl;
  }

  const prompt = `
    Provide a single, high-quality, visually stunning, landscape-oriented (16:9 aspect ratio) image URL representing the travel destination: "${destination}, India".
    The image should be suitable for a website hero banner. Focus on iconic landmarks or breathtaking natural scenery that is representative and inspiring.
    Return ONLY a valid JSON object in the format: {"imageUrl": "YOUR_IMAGE_URL_HERE"}
    Do not include any introductory text, explanations, or markdown formatting. Just the raw JSON object.
  `;

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });
    // Accessing response correctly based on Gemini's structure
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || result.response.text(); 
    const cleanedJson = cleanAndExtractJson(responseText);

    if (!cleanedJson) {
        console.warn(`No JSON extracted for hero image of ${destination}. Raw:`, responseText);
        return defaultImageUrl;
    }
    
    const parsedResponse = JSON.parse(cleanedJson);
    if (parsedResponse && parsedResponse.imageUrl && typeof parsedResponse.imageUrl === 'string' && parsedResponse.imageUrl.startsWith('http')) {
      return parsedResponse.imageUrl;
    } else {
      console.warn(`No valid imageUrl in AI response for hero image of ${destination}:`, parsedResponse);
      return defaultImageUrl;
    }
  } catch (error) {
    console.error(`Error fetching/parsing hero image for ${destination} from AI:`, error);
    return defaultImageUrl;
  }
};

export const fetchDestinationCardImages = async (destinationName, count = 1) => {
  const defaultImage = { url: `${placeholderBaseUrl}/600x400/AAB8C2/FFF?text=${encodeURIComponent(destinationName)}+Not+Found&font=lato`, alt: `Image of ${destinationName} not found` };
  if (!destinationName) {
    console.warn("fetchDestinationCardImages: No destination name provided.");
    return Array(count).fill(defaultImage);
  }

  const prompt = `
    Generate a JSON array of exactly ${count} unique, high-quality, visually appealing image URLs for the travel destination "${destinationName}, India".
    Each image should be suitable for a small card (e.g., aspect ratio around 4:3 or 16:10). Prioritize diverse scenes: iconic landmarks, beautiful nature, vibrant cultural elements, or characteristic local life.
    Each object in the array MUST have only two properties: "url" (a publicly accessible HTTPS image URL) and "alt" (a concise, descriptive alt text for the image, e.g., "Taj Mahal at sunset from Yamuna river bank").
    Return ONLY a valid JSON array. Example: [{"url": "https://example.com/image1.jpg", "alt": "Description for image 1"}]
    Do not include any introductory text, explanations, or markdown formatting. Just the raw JSON array.
  `;

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || result.response.text();
    const cleanedJson = cleanAndExtractJson(responseText);

    if (!cleanedJson) {
        console.warn(`No JSON extracted for card images of ${destinationName}. Raw:`, responseText);
        return Array(count).fill(defaultImage);
    }

    const parsedResponse = JSON.parse(cleanedJson);

    if (Array.isArray(parsedResponse) && parsedResponse.length > 0 && parsedResponse.every(item => item && typeof item.url === 'string' && item.url.startsWith('http') && typeof item.alt === 'string')) {
      return parsedResponse.slice(0, count).map(item => ({
          ...item,
          url: item.url 
      }));
    } else {
      console.warn(`Invalid or incomplete image data from AI for card images of ${destinationName}:`, parsedResponse);
      return Array(count).fill(defaultImage);
    }
  } catch (error) {
    console.error(`Error fetching/parsing card images for ${destinationName} from AI:`, error);
    return Array(count).fill(defaultImage);
  }
};