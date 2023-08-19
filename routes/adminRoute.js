const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware');
const bcrypt = require('bcrypt');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Equipment = require('../models/Equipment');
const PersonalTrainer = require('../models/PersonalTrainer');
const Client = require('../models/Client');

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

// Função para calcular o total de ganhos
function calculateTotalEarnings(clients) {
  const monthlyFee = 100;
  const activeClients = clients.filter(client => client.isPaid);
  const totalEarnings = monthlyFee * activeClients.length;
  return totalEarnings;
}

// pagina inicial de dashboard
router.get('/dashboard/home', authMiddleware(['admin', 'personal']), async (req, res) => {
  try {
    const lessons = await Lesson.getAll();
    const simplifiedLessons = lessons.map(lesson => {
      return {
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        data: formatDate(lesson.data),
        time: formatTime(lesson.time),
        personal: lesson.personal,
      };
    });

    const filterequipments = await Equipment.getAllFilterEquipments({ quality: 'defective' });
    const numerOfPersonals = (await PersonalTrainer.getAllPersonals()).length;
    const filterclients = await Client.getAllFilterClients({ isPaid: false });
    const clients = await Client.getAllClients();
    const totalEarnings = calculateTotalEarnings(clients);
    const totalclients = (await Client.getAllClients()).length;
    const activeClients = await Client.getAllFilterClients({ isPaid: true });
    const totalclientsative = activeClients.length;

    res.render('dashboard', { data: simplifiedLessons, equip: filterequipments, numberOfPersonals: numerOfPersonals, clients: filterclients, earned: totalEarnings, totalClients: totalclients, totalClientsAtivos: totalclientsative });
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Carrega a página de aulas
router.get('/lessons', authMiddleware(['admin', 'personal']), async (req, res) => {
  try {
    const lessons = await Lesson.getAll();
    const simplifiedLessons = lessons.map(lesson => {
      return {
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        data: formatDate(lesson.data),
        time: formatTime(lesson.time),
        personal: lesson.personal,
      };
    });
    res.render('lessons', { data: simplifiedLessons });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Carrega a página de postar aulas
router.get('/create_lessons', authMiddleware(['admin', 'personal']), async (req, res) => {
  try {
    const personals = await PersonalTrainer.getAllPersonals();
    res.render('create_lesson', { data: personals });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Posta novas aulas
router.post('/lessons', authMiddleware(['admin', 'personal']), async (req, res) => {
  const { title, description, data, time, personalId } = req.body;
  try {
    const personalTrainer = await PersonalTrainer.getPersonalById(personalId);

    if (!personalTrainer) {
      //return res.status(404).json({ error: 'Personal trainer not found' });
     return res.render('tela_error', {code: 404, error: 'Personal trainer not found' });
    }

    const newLesson = new Lesson(title, description, data, time, personalTrainer._id);
    await newLesson.save();
    res.redirect('/lessons');
  } catch (error) {
    console.error('Error Saving Lesson:', error);
    // res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Rota para renderizar formulario de edicao da aula
router.get('/lesson/edit/:id', authMiddleware(['admin', 'personal']), async(req, res) => {
  const lessonId = req.params.id;
  try {
    const lesson = await Lesson.getLessonById(lessonId);
    const personals = await PersonalTrainer.getAllPersonals();
    res.render('edit_lessons', {lesson, data: personals});
  } catch (error) {
    //res.status(500).json({error: 'Internal server error'});
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Atualizar uma aula existente
router.put('/lesson/edit/:id', authMiddleware(['admin', 'personal']), async(req, res) => {
  const lessonId = req.params.id;
  const {title, description, data, time, personal } = req.body;
  try {
    const lesson = new Lesson(title, description, data, time, personal);
    lesson._id = lessonId;
    const updatedLesson = await lesson.updateLesson();
    if (!updatedLesson) {
      //return res.status(404).json( {error: 'Lesson not found'} )
      return res.render('tela_error', {code: 404, error: 'Lesson not found' });
    }
    res.redirect('/lessons');
  } catch (error) {
    //res.status(500).json({ error: 'Internal server error' })
    return res.render('tela_error', {code: 404, error: 'Internal server error' });
  }
});

// Deleta aulas aulas a partir do id
router.delete('/lessons/delete/:id', authMiddleware(['admin', 'personal']), async (req, res) => {
  const lessonId = req.params.id;
  try {
    const lesson = await Lesson.delete(lessonId);
    if (!lesson) {
      //return res.status(404).json({ error: 'Lesson not found' });
      return res.render('tela_error', {code: 404, error: 'Lesson not found' });
    }
    res.status(204).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error Deleting Lesson:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Carrega todos os personals do banco de dados
router.get('/personals', authMiddleware(['admin']), async (req, res) => {
  try {
    const personals = await PersonalTrainer.getAllPersonals();
    res.render('personals', { data: personals });
  } catch (error) {
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Posta novos personal trainers
router.post('/personals', authMiddleware(['admin']), async (req, res) => {
  const { age, name, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newPersonal = new PersonalTrainer(name, age, username, hashedPassword);
    await newPersonal.createPersonal();
    res.redirect('/personals');
  } catch (error) {
    console.error('Error Saving Personal:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Rota para renderizar o formulário de edição do personal
router.get('/personal/edit/:id', authMiddleware(['admin']), async (req, res) => {
  const personalId = req.params.id;
  try {
    const personal = await PersonalTrainer.getPersonalById(personalId);
    res.render('edit_personal', { personal });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Atualizar um personal existente
router.put('/personal/edit/:id', authMiddleware(['admin']), async (req, res) => {
  const personalId = req.params.id;
  const { name, age, username, password } = req.body;
  try {
    const personal = new PersonalTrainer(name, age, username, password);
    personal._id = personalId;
    const updatedPersonal = await personal.updatePersonal();
    if (!updatedPersonal) {
      //return res.status(404).json({ error: 'Personal not found' });
      return res.render('tela_error', {code: 404, error: 'Personal trainer not found' });
    }
    res.redirect('/personals')
  } catch (error) {
    console.error('Error updating personal:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Deleta personal a partir de um id
router.delete('/personal/delete/:id', authMiddleware(['admin']), async (req, res) => {
  const personalId = req.params.id;
  try {
    const personal = await PersonalTrainer.deletePersonal(personalId);
    if (!personal) {
      //return res.status(404).json({ error: 'Personal not found' });
      return res.render('tela_error', {code: 404, error: 'Personal not found' });
    }
    res.status(204).json({ message: 'Personal deleted successfully' });
  } catch (error) {
    console.error('Error Deleting Personal:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Carrega a página de equipamentos
router.get('/equipments', authMiddleware(['admin']), async (req, res) => {
  try {
    const equipamentos = await Equipment.getAllEquipments();
    res.render('equipments', { data: equipamentos });
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Posta um novo equipamento
router.post('/equipments', authMiddleware(['admin']), async (req, res) => {
  const { name, description, quantity, quality } = req.body;
  try {
    const newEquipment = new Equipment(name, description, quantity, quality);
    await newEquipment.saveEquipment();
    res.redirect('/equipments');
  } catch (error) {
    console.error('Error creating equipment:', error);
    //res.status(500).json({ error: 'Erro interno do servidor' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Rota para renderizar o formulário de edição do equipamento
router.get('/equipments/edit/:id', authMiddleware(['admin']), async (req, res) => {
  const equipmentId = req.params.id;
  try {
    const equipment = await Equipment.getEquipmentById(equipmentId);
    res.render('edit_equipment', { equipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Atualizar um equipamento existente
router.put('/equipments/edit/:id', authMiddleware(['admin']), async (req, res) => {
  const equipmentId = req.params.id;
  const { name, description, quantity, quality } = req.body;
  try {
    const equipment = new Equipment(name, description, quantity, quality);
    equipment._id = equipmentId;
    const updatedEquipment = await equipment.updateEquipment();
    if (!updatedEquipment) {
      //return res.status(404).json({ error: 'Equipment not found' });
      return res.render('tela_error', {code: 404, error: 'Equipment not found '});
    }
    res.redirect('/equipments')
  } catch (error) {
    console.error('Error updating equipment:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Excluir um equipamento
router.delete('/equipments/delete/:id', authMiddleware(['admin']), async (req, res) => {
  const equipmentId = req.params.id;
  try {
    const deletedEquipment = await Equipment.deleteEquipment(equipmentId);

    if (!deletedEquipment) {
      //return res.status(404).json({ error: 'Equipment not found' });
      return res.render('tela_error', {code: 404, error: 'Equipment not found' });
    }

    res.status(204).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// listar todos os clientes
router.get('/clients', authMiddleware(['admin']), async (req, res) => {
  try {
    const clients = await Client.getAllClients();
    res.render('create_client', { data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// listar todos os pagamentos pendentes
router.get('/payments', authMiddleware(['admin']), async (req, res) => {
  try {
    const allClients = await Client.getAllClients();
    const paidClients = allClients.filter(client => client.isPaid);
    const unpaidClients = allClients.filter(client => !client.isPaid);

    res.render('payments', { data: { paidClients, unpaidClients }});
  } catch (error) {
    console.error('Error fetching equipments:', error);
   // res.status(500).json({ error: 'Internal server error' });
   return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Marcar que um usuario pagou a mensalidade
router.put('/clients/:id/mark-as-paid', authMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await Client.updatePaymentStatus(id);
    res.status(200).json({ message: 'Client marked as paid.' });
  } catch (error) {
    //res.status(500).json({ message: error.message });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Posta um novo cliente
router.post('/clients', authMiddleware(['admin']), async (req, res) => {
  const { name, email, cpf, age, sex, isPaid, data } = req.body;
  try {
    const newClient = new Client(name, email, cpf, age, sex, isPaid, data);
    await newClient.createClient();
    const allclients = Client.getAllClients();
    console.log(allclients);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Route to render the edit form for a client
router.get('/client/edit/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.getClientById(clientId);
    res.render('edit_client', { client });
  } catch (error) {
    console.error('Error fetching client:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});


// Atualizar um cliente existente
// ToDo: Atualizar essa função para relacionar com orietação a objetos
router.put('/clients/:id', authMiddleware(['admin']), async (req, res) => {
  const clientId = req.params.id;
  const { name, email, cpf, age, sex, isPaid, data } = req.body;
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        name,
        email,
        cpf,
        age,
        sex,
        isPaid,
        data,
      },
      { new: true }
    );

    if (!updatedClient) {
      //return res.status(404).json({ error: 'Client not found' });
      return res.render('tela_error', {code: 404, error: 'Client not found' });
    }
    res.redirect('/clients');
  } catch (error) {
    console.error('Error updating client:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Excluir um cliente
router.delete('/clients/:id', authMiddleware(['admin']), async (req, res) => {
  const clientId = req.params.id;
  try {
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      //return res.status(404).json({ error: 'Client not found' });
      return res.render('tela_error', {code: 404, error: 'Client not found' });
    }

    res.json(deletedClient);
  } catch (error) {
    console.error('Error deleting client:', error);
    //res.status(500).json({ error: 'Internal server error' });
    return res.render('tela_error', {code: 500, error: 'Internal server error' });
  }
});

// Função para atualizar o status dos pagamentos a cada dia
async function updatePaymentsStatusDaily() {
  try {
    await Client.updatePaymentStatus();
  } catch (error) {
    console.error('Error updating payment status:', error.message);
  }
}

// Iniciar a atualização dos pagamentos ao iniciar o servidor
updatePaymentsStatusDaily();

// Atualizar os pagamentos diariamente (a cada 24 horas)
setInterval(updatePaymentsStatusDaily, 24 * 60 * 60 * 1000);

router.get('*', (req, res) => {
  return res.render('tela_error', {code: 404, error: 'Invalid route' });
});

module.exports = router;
