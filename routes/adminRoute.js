const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

// Verifica se o login foi autorizado
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

// Carrega a página de login
router.get('/admin', async (req, res) => {
  try {
    res.render('tela_login');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recebe os dados de login
router.post('/admin', async (req, res) => {
    try {
      const { admname, password } = req.body;
      
      const admlogin = new Admin(process.env.ADM_USER, process.env.ADM_PASS);

      // Verifica se os dados estão corretos
      if (admname !== admlogin.admname || password !== admlogin.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: admname }, jwtSecret);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/lessons');
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Carrega a página de postar aulas
router.get('/lessons', authMiddleware, async (req, res) => {
  try {
    res.render('create_lesson');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posta novas aulas
router.post('/lessons', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newLesson = new Lesson(title, description);
    await newLesson.save();
    // res.status(201).json(savedLesson);
    res.redirect('/');
  } catch (error) {
    console.error('Error Saving Lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deleta aulas aulas a partir do id
router.delete('/lessons/:id', authMiddleware, async (req, res) => {
  const lessonId = req.params.id;
  try {
    const lesson = await Lesson.delete(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.redirect('/');
  } catch (error) {
    console.error('Error Deleting Lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Termina a seção de login do administrador
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;