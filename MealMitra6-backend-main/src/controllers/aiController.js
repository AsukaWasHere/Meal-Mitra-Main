import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * @desc    Get AI suggestions for charities
 * @route   POST /api/ai/suggest
 * @access  Public
 */
export const getSuggestions = async (req, res) => {
  try {
    const { location, foodType } = req.body;

    if (!location || !foodType) {
      return res.status(400).json({ success: false, message: "Location and food type are required." });
    }

    // Initialize the Gemini AI model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a detailed prompt for the AI
    const prompt = `
      Based on the following information, suggest 3 real or realistic-sounding charities, NGOs, or soup kitchens.
      - City: ${location}
      - Type of surplus food: ${foodType}
      
      The suggestions should be for places that would likely accept a donation of this type of food.
      Please provide the output ONLY in a valid JSON format like this, with no extra text or markdown:
      {
        "suggestions": [
          { "name": "Name of Charity 1", "contact": "+91-XXXXXXXXXX" },
          { "name": "Name of Charity 2", "contact": "+91-XXXXXXXXXX" },
          { "name": "Name of Charity 3", "contact": "+91-XXXXXXXXXX" }
        ]
      }
    `;

    // Generate content using the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON string from the AI's response
    const suggestions = JSON.parse(text);

    res.status(200).json({ success: true, ...suggestions });

  } catch (error) {
    console.error("Error with Gemini AI:", error);
    res.status(500).json({ success: false, message: "Failed to get AI suggestions. Please try again." });
  }
};

// Add this to MealMitra6-backend-main/src/controllers/aiController.js

// Inside your chatWithAI function in MealMitra6-backend-main/src/controllers/aiController.js

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 User said:", message);

    if (!message) {
      return res.status(400).json({ success: false, message: "No message provided." });
    }

    // 1. Initialize the AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Use 'gemini-2.5-flash' - This is the NEW stable version for late 2025
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("🤖 Asking Gemini 2.5...");

    // 3. Generate the response
    const result = await model.generateContent(message);
    const text = result.response.text();
    
    console.log("✅ Gemini replied:", text);
    res.status(200).json({ success: true, reply: text });

  } catch (error) {
    console.error("🔥 CHATBOT ERROR:", error);
    res.status(500).json({ success: false, message: "AI is unavailable right now." });
  }
};