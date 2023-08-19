const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const PersonalTrainer = require('../models/PersonalTrainer');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Workout = require('../models/Workout');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;

// Função para formatar a data no formato "dd/mm/aaaa"
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Função para formatar o tempo no formato "hh:mm"
function formatTime(timeString) {
  const time = new Date(`1970-01-01T${timeString}`);
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Carrega todas as aulas do banco de dados
router.get('/', async (req, res) => {
    try {
      const lessons = await Lesson.getAll();
      // Extrair somente os campos que queremos (title, description, and personal)
      const simplifiedLessons = lessons.map(lesson => {
        return {
          title: lesson.title,
          description: lesson.description,
          data: formatDate(lesson.data),
          time: formatTime(lesson.time),
          personal: lesson.personal,
        };
      });
      res.render('main_page', { data: simplifiedLessons });
    } catch (error) {
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
    }
});

// Carrega uma aula a partir do id
router.get('/lessons/:id', async (req, res) => {
  const lessonId = req.params.id;
  try {
    const lesson = await Lesson.getById(lessonId);
    if (!lesson) {
      //res.status(404).json({ error: 'Lesson not found' });
      return res.render('tela_error', {code: 404, error: 'Lesson not found' });
    } else {
      res.json(lesson);
    }
  } catch (error) {
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Carrega a página de login
router.get('/login', async (req, res) => {
  try {
    res.render('tela_login');
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Recebe os dados de login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admlogin = new Admin(process.env.ADM_USER, process.env.ADM_PASS);
    // Verifica se os dados estão corretos
    if (username === admlogin.username && password === admlogin.password) {
      const token = jwt.sign({ userId: username, role: 'admin' }, jwtSecret);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard/home');
    } else {
      const personal = await PersonalTrainer.getPersonalUser(username);
      if(!personal) {
        return res.render('tela_error', {code: 401, error: 'Credenciais inválidas' });
      }
      const isPasswordValid = await bcrypt.compare(password, personal.password);
      if(!isPasswordValid) {
        return res.render('tela_error', {code: 401, error: 'Credenciais inválidas' });
      }
      const token = jwt.sign({ userId: username, role: 'personal' }, jwtSecret);
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard/home');
    }  
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

router.get('/search_exercise', async (req, res) => {
  try {
    const { cpf } = req.query;
    if (!cpf) {
      return res.render('tela_error', { code: 400, error: 'CPF parameter is required' });
    }
    const today = new Date();
    const dayOfWeek = today.getDay();

    const daysOfWeekNames = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    const dayName = daysOfWeekNames[dayOfWeek];
    //console.log('Dia da semana: ', dayName);
    const workout = await Workout.findExistingWorkoutbyCPF(cpf, dayName);

    if (workout) {
      return res.render('client_workout', { workout: workout });
    } else {
      return res.render('tela_error', { code: 404, error: 'Workout not found for today' });
    }
  } catch (error) {
    console.log(error);
    return res.render('tela_error', { code: 500, error: 'Internal server error' });
  }
});

// Termina a seção de login do administrador
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;