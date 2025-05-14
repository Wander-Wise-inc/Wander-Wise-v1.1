// src/service/AIModel.jsx
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

let genAIInstance;
let modelInstance;

if (!apiKey) {
  console.error(
    "VITE_GOOGLE_GEMINI_AI_API_KEY is not set. AI features will be severely limited or non-functional."
  );
  // Provide a mock genAI and model to prevent crashes if the key is missing
  genAIInstance = {
    getGenerativeModel: () => ({
      startChat: (options) => ({
        sendMessage: async (message) => {
          console.warn("AI Model: API Key missing. Returning mock response for message:", message);
          return { response: { text: () => "I'm sorry, the AI service is not configured correctly. Please check the API key." } };
        },
        // Add other methods if your app expects them from chatSession
      }),
      generateContent: async (prompt) => {
        console.warn("AI Model: API Key missing. Returning mock response for prompt:", prompt);
        return { response: { text: () => JSON.stringify({ error: "AI Service not configured. API Key is missing."}) } };
      }
    }),
  };
  modelInstance = genAIInstance.getGenerativeModel({ model: "mock-model" });
} else {
  genAIInstance = new GoogleGenerativeAI(apiKey);
  modelInstance = genAIInstance.getGenerativeModel({
    model: "gemini-1.5-flash-latest", // Using flash for potentially faster responses for chat & structured data
    // System instruction can be powerful for setting context and persona
    // systemInstruction: "You are WanderWise AI, a friendly and expert travel planner for India. Provide concise, helpful, and inspiring travel advice. When generating structured data like JSON, strictly adhere to the requested format.",
  });
}

const defaultGenerationConfig = {
  temperature: 0.7, // Balanced temperature
  topP: 0.9,
  topK: 30, // Slightly reduced for more focused responses
  maxOutputTokens: 8192,
  // responseMimeType: "application/json", // Set this per-request if needed, or if all responses are JSON
};

// Refined initial history for a more engaging and guiding AI persona
const initialChatHistory = [
  {
    role: "user",
    parts: [
      {text: "You are WanderWise AI, an enthusiastic and highly knowledgeable travel expert for India. Your primary goal is to help users plan incredible trips by providing personalized recommendations, detailed itineraries, and practical travel tips. Be creative, culturally sensitive, and always aim to inspire. When asked for structured data (like JSON for itineraries or image lists), ensure your output is precise and strictly adheres to the requested format without any extra conversational text or markdown. Let's begin!"},
    ],
  },
  {
    role: "model",
    parts: [
      {text: "Namaste! I'm WanderWise AI, absolutely thrilled to be your guide to the enchanting lands of India! 🇮🇳 Whether you're dreaming of majestic palaces, serene backwaters, spiritual Himalayan retreats, or vibrant cityscapes, I'm here to help you craft the perfect adventure. To start, could you share a bit about your travel dreams? Where in India are you thinking of exploring, and what kind of experiences ignite your wanderlust?"},
    ],
  },
  // Retaining the structured JSON example for guidance
   {
      role: "user",
      parts: [
        {text: "Generate a travel plan for Mumbai for 3 days for 3 people with a budget of 20,000 rupees per day. Give me hotel options with name, image URL, location, price, geo-coordinates, rating, and description. Also, suggest an itinerary with place name, details, price, image URL, geo-coordinates, travel time, and best time to visit, all in JSON format. Only provide the JSON output."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"trip_details\": {\n    \"location\": \"Mumbai, India\",\n    \"duration_days\": 3,\n    \"num_people\": 3,\n    \"budget_per_day_inr\": 20000\n  },\n  \"hotel_options\": [\n    {\n      \"name\": \"The Oberoi, Mumbai\",\n      \"imageUrl\": \"[https://example.com/oberoi_mumbai.jpg](https://example.com/oberoi_mumbai.jpg)\",\n      \"location_area\": \"Nariman Point, Marine Drive\",\n      \"price_range_per_night_inr\": \"15000-22000\",\n      \"geo_coordinates\": {\"latitude\": 18.9324, \"longitude\": 72.8314},\n      \"rating_stars\": 5,\n      \"description\": \"Luxurious hotel with stunning sea views, exceptional service, and fine dining.\"\n    }\n  ],\n  \"itinerary_plan\": [\n    {\n      \"day_number\": 1,\n      \"day_theme\": \"Iconic South Mumbai & Colonial Charm\",\n      \"activities\": [\n        {\n          \"place_name\": \"Gateway of India\",\n          \"details\": \"Historic arch-monument, a symbol of Mumbai, overlooking the Arabian Sea.\",\n          \"estimated_cost_inr\": \"Free\",\n          \"imageUrl\": \"[https://example.com/gateway_of_india_mumbai.jpg](https://example.com/gateway_of_india_mumbai.jpg)\",\n          \"geo_coordinates\": {\"latitude\": 18.9220, \"longitude\": 72.8347},\n          \"estimated_time_duration\": \"1-2 hours\",\n          \"best_time_to_visit\": \"Early morning or late afternoon for pleasant weather and good photos.\"\n        }\n      ]\n    }\n  ]\n}\n```"},
      ],
    },
];

export const startAIChatSession = (customHistory, generationConfigOverrides) => {
  if (!apiKey) {
    console.warn("AI Chat Session cannot start: API key missing. Returning mock session.");
    return {
      sendMessage: async (message) => ({ response: { text: () => "AI Service is not configured." } }),
      // history: customHistory || initialChatHistory, // Can still provide history for UI
    };
  }
  return modelInstance.startChat({
    generationConfig: { ...defaultGenerationConfig, ...generationConfigOverrides },
    history: customHistory || initialChatHistory,
    safetySettings: [ // Basic safety settings
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });
};

// Default chat session for simple, direct use if needed
export const chatSession = startAIChatSession();

// Export the model instance directly if needed for generateContent calls outside of a chat
export const generativeModel = modelInstance;
