const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const Client = require('../models/Client');
const Equipment = require('../models/Equipment');
const Workout = require('../models/Workout');


router.get('/create_workout', authMiddleware(['personal']), async (req, res) => {
    try {
      const clients = await Client.getAllClients();
      const equipmentOptions = await Equipment.getAllEquipments();
      res.render('create_workout', { clients, equipmentOptions });
    } catch (error) {
      console.log(error);
      return res.render('tela_error', { code: 500, error: 'Internal server error' });
    }
  });
  
router.post('/create_workout', authMiddleware(['personal']), async (req, res) => {
  let { title, description, dayOfWeek, clientId, selectedEquipment } = req.body;

  try {
    const clientCPF = await Client.findCPFById(clientId);
    
    const workoutExists = await Workout.workoutExistsForDay(clientCPF, dayOfWeek);
    if (workoutExists) {
      return res.render('tela_error', { code: 500, error: 'A workout already exists for this day' });
    }
    
    if (!Array.isArray(selectedEquipment)) {
      selectedEquipment = [selectedEquipment];
    }

    const newWorkout = new Workout(
      title,
      description,
      dayOfWeek,
      clientId,
      clientCPF,
      selectedEquipment
    );

    await newWorkout.save();
    res.redirect('/dashboard/home');
  } catch (error) {
    console.log(error);
    return res.render('tela_error', { code: 500, error: 'Internal server error' });
  }
});

router.get('/view_workouts/:clientId', authMiddleware(['personal']), async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const client = await Client.getClientById(clientId);

    if (!client) {
      return res.render('tela_error', { code: 404, error: 'Client not found' });
    }

    const workouts = await Workout.findWorkoutByCPF(client.cpf);
    res.render('view_workouts', { client, workouts });
  } catch (error) {
    console.log(error);
    return res.render('tela_error', { code: 500, error: 'Internal server error' });
  }
});



module.exports = router;