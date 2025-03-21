const express = require('express'); // Fixed typo
const chatRouter = express.Router();
const Chat = require('../models/chat');
const {userAuth} = require('../middlewares/auth');

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const targetUserId = req.params.targetUserId; // Correctly access targetUserId
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
    }).populate(
        {
            path:"messages.senderId",
            select:"firstName lastName"
        }

    );

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
        }

        await chat.save();
        res.status(200).json(chat); // Return the chat object as a response
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = chatRouter;