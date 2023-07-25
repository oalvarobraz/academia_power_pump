require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const database = mongoose.connection;

app.use('/', require('./routes/mainRoute'));
app.use('/', require('./routes/adminRoute'));

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