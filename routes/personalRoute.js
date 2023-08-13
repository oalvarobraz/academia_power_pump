const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const Client = require('../models/Client');
const Workout = require('../models/Workout');

// Carrega a página de criação de treinos
router.get('/create_workout', authMiddleware(['personal']), async (req, res) => {
    try {
      const clients = await Client.getAllClients();
      res.render('create_workout', { clients }); 
    } catch (error) {
      console.log(error);
      return res.render('tela_error', { code: 500, error: 'Internal server error' });
    }
  });
  
  // Rota para lidar com o envio do formulário de criação de treinos
  router.post('/create_workout', authMiddleware(['personal']), async (req, res) => {
    const { title, description, dayOfWeek, clientId } = req.body;
    const personalId = req.user.id; 
  
    try {
      const newWorkout = await Workout.scheduleWorkout(title, description, dayOfWeek, clientId, personalId);
      res.redirect('/personal/dashboard'); 
    } catch (error) {
      console.log(error);
      return res.render('tela_error', { code: 500, error: 'Internal server error' });
    }
  });

module.exports = router;