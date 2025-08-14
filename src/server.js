const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log(err));

// Example Schema
const TopicSchema = new mongoose.Schema({
    subject: String,
    topic_name: String,
    status: String,
    notes: String,
    target_date: Date,
    completion_date: Date
});
const Topic = mongoose.model('Topic', TopicSchema);

// CRUD Routes
app.get('/topics', async (req, res) => {
    const topics = await Topic.find();
    res.json(topics);
});

app.post('/topics', async (req, res) => {
    const topic = new Topic(req.body);
    await topic.save();
    res.json(topic);
});

app.put('/topics/:id', async (req, res) => {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(topic);
});

app.delete('/topics/:id', async (req, res) => {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Topic deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
