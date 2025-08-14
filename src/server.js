// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// MongoDB Connection
// =========================
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// =========================
// Schema & Model
// =========================
const TopicSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    topic_name: { type: String, required: true },
    status: { type: String, default: 'pending' },
    notes: String,
    target_date: Date,
    completion_date: Date
}, { timestamps: true });

const Topic = mongoose.model('Topic', TopicSchema);

// =========================
// Routes
// =========================

// Health check
app.get('/', (req, res) => {
    res.send({ status: 'Server is running 🚀' });
});

// Get all topics
app.get('/topics', async (req, res) => {
    try {
        const topics = await Topic.find();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// Create topic
app.post('/topics', async (req, res) => {
    try {
        const topic = new Topic(req.body);
        await topic.save();
        res.status(201).json(topic);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create topic' });
    }
});

// Update topic
app.put('/topics/:id', async (req, res) => {
    try {
        const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!topic) return res.status(404).json({ error: 'Topic not found' });
        res.json(topic);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update topic' });
    }
});

// Delete topic
app.delete('/topics/:id', async (req, res) => {
    try {
        const deleted = await Topic.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Topic not found' });
        res.json({ message: 'Topic deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete topic' });
    }
});

// =========================
// Start server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
