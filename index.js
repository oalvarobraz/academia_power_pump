require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Lesson = require('./models/Lesson');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const database = mongoose.connection;

app.use('/', require('./routes/adminRoute'));

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});

// Database connection event handlers
database.on('error', (error) => {
  console.log('Database Connection Error:', error);
});

database.once('connected', () => {
  console.log('Database Connected');
});