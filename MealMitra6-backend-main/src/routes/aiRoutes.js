import express from 'express';
import { getSuggestions, chatWithAI } from '../controllers/aiController.js'; // Update import

const router = express.Router();

// @route   POST /api/ai/suggest
// @desc    Get AI-powered suggestions for charities
router.post('/suggest', getSuggestions);

export default router;

// Add this line to MealMitra6-backend-main/src/routes/aiRoutes.js


router.post('/chat', chatWithAI); // Add this new route