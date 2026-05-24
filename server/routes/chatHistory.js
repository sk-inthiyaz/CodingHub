const express = require('express');
const ChatHistory = require('../models/ChatHistory');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all chat histories for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    // Convert to ObjectId if valid
    const objectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    // Find all chats and sort by last message timestamp
    const histories = await ChatHistory.aggregate([
      { $match: { userId: objectId } },
      { $addFields: {
        lastMessageTime: {
          $ifNull: [
            { $max: "$messages.timestamp" },
            "$created"
          ]
        }
      }},
      { $sort: { lastMessageTime: -1 } }
    ]);
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new chat history
router.post('/', auth, async (req, res) => {
  try {
    console.log('POST /api/chat-history body:', req.body);
    let { userId, messages, title } = req.body;

    // Fallback: try to get userId from req.user if not provided (if using auth middleware)
    if (!userId && req.user && req.user.userId) {
      userId = req.user.userId;
    }

    // Input validation
    if (!userId || !Array.isArray(messages) || messages.length === 0 || !title) {
      console.error('Validation error: userId missing or invalid', { userId, messages, title });
      return res.status(400).json({ error: 'userId, messages (array, not empty), and title are required.' });
    }

    // Convert userId to ObjectId if valid, otherwise leave as string
    if (mongoose.Types.ObjectId.isValid(userId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }

    // Optional: Check that at least one user and one ai message exist
    const hasUserMsg = messages.some(msg => msg.role === 'user');
    const hasAiMsg = messages.some(msg => msg.role === 'ai');
    if (!hasUserMsg || !hasAiMsg) {
      console.error('Validation error: missing user or ai message', messages);
      return res.status(400).json({ error: 'Chat history must include at least one user and one ai message.' });
    }

    // Save chat
    const chat = new ChatHistory({ userId, messages, title });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Optionally: update a chat history (e.g., add messages)
router.put('/:id', auth, async (req, res) => {
  try {
    const chat = await ChatHistory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optionally: delete a chat history
router.delete('/:id', auth, async (req, res) => {
  try {
    await ChatHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat history deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
