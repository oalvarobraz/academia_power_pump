const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Lesson = require('./models/Lesson');

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const database = mongoose.connection;

app.use(express.json());

// Define a route handler for the root URL
app.get('/', async (req, res) => {
    try {
      const lessons = await Lesson.getAll();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/lessons/:id', async (req, res) => {
  const lessonId = req.params.id;
  try {
    const lesson = await Lesson.getById(lessonId);
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
    } else {
      res.json(lesson);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/lessons', async (req, res) => {
    const { title, description } = req.body;
    try {
      const newLesson = new Lesson(title, description);
      const savedLesson = await newLesson.save();
      res.status(201).json(savedLesson);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(3000, () => {
    console.log('Server Started at http://localhost:3000');
});

database.on('error', (error) => {
    console.log('Database Connection Error:', error);
});

database.once('connected', () => {
    console.log('Database Connected');
});