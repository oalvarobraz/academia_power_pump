const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const jwtSecret = process.env.JWT_SECRET;

/**
 * Check Login
*/
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.userId !== process.env.ADM_USER) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

/**
 * Admin - Login Page
*/
router.get('/admin', async (req, res) => {
  try {
    const indexPath = path.join(__dirname, '..', 'views', 'login.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Admin - Check Login
*/
router.post('/admin', async (req, res) => {
    try {
      const { admname, password } = req.body;
      
      const admlogin = new Admin(process.env.ADM_USER, process.env.ADM_PASS);
  
      if (admname !== admlogin.admname || password !== admlogin.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: admname }, jwtSecret);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/');
    } catch (error) {
      //console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/lessons', async (req, res) => {
  try {
    const indexPath = path.join(__dirname, '..', 'views', 'create_lesson.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/lessons', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newLesson = new Lesson(title, description);
    console.log(newLesson.title);
    const savedLesson = await newLesson.save();
    res.status(201).json(savedLesson);
    res.redirect('/');
  } catch (error) {
    console.error('Error Saving Lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/lessons/:id', authMiddleware, async (req, res) => {
  const lessonId = req.params.id;
  try {
    const lesson = await Lesson.delete(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.status(200).json({ message: 'Lesson deleted successfully' });
    res.redirect('/');
  } catch (error) {
    console.error('Error Deleting Lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;