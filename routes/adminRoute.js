const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware');
const bcrypt = require('bcrypt');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Equipment = require('../models/Equipment');
const PersonalTrainer = require('../models/PersonalTrainer');

// Carrega a página de postar aulas
router.get('/lessons', authMiddleware(['admin', 'personal']), async (req, res) => {
  try {
    const personals = await PersonalTrainer.getAllPersonals();
    res.render('create_lesson', { data: personals });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posta novas aulas
router.post('/lessons', authMiddleware(['admin', 'personal']), async (req, res) => {
  const { title, description, personalId } = req.body;
  try {
    const personalTrainer = await PersonalTrainer.getPersonalById(personalId);

    if (!personalTrainer) {
      return res.status(404).json({ error: 'Personal trainer not found' });
    }

    const newLesson = new Lesson(title, description, personalTrainer._id);
    await newLesson.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error Saving Lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deleta aulas aulas a partir do id
router.delete('/lessons/:id', authMiddleware(['admin', 'personal']), async (req, res) => {
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

// Carrega todos os personals do banco de dados
router.get('/personals', authMiddleware(['admin']), async (req, res) => {
  try {
    const personals = await PersonalTrainer.getAllPersonals();
    res.render('personals', { data: personals });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posta novos personal trainers
router.post('/personals', authMiddleware(['admin']), async (req, res) => {
  const { age, name, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newPersonal = new PersonalTrainer(name, age, username, hashedPassword);
    await newPersonal.createPersonal();
    res.status(201).json({message: 'Personal Created'});
  } catch (error) {
    console.error('Error Saving Personal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Carrega a página de equipamentos
router.get('/equipments', authMiddleware(['admin']), async (req, res) => {
  try {
    res.render('equipments');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// listar todos os equipamentos
router.get('/equipments', authMiddleware(['admin']), async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.json(equipments);
  } catch (error) {
    console.error('Error fetching equipments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Posta um novo equipamento
router.post('/equipments', authMiddleware(['admin']), async (req, res) => {
  const { name, description, quantity, quality } = req.body;
  try {
    const newEquipment = new Equipment(name, description, quantity, quality);
    await newEquipment.saveEquipment();
    res.status(201).json(newEquipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar um equipamento existente
router.put('/equipments/:id', authMiddleware(['admin']), async (req, res) => {
  const equipmentId = req.params.id;
  const { name, description, quantity } = req.body;
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      {
        name,
        description,
        quantity,
      },
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json(updatedEquipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Excluir um equipamento
router.delete('/equipments/:id', authMiddleware, async (req, res) => {
  const equipmentId = req.params.id;
  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(equipmentId);

    if (!deletedEquipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json(deletedEquipment);
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;