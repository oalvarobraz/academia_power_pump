require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');

const app = express(); // Criação da instância do aplicativo do framework Express

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração dos middlewares globais
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const database = mongoose.connection;

// Importação e utilização das rotas do aplicativo
app.use('/', require('./routes/mainRoute'));
app.use('/', require('./routes/adminRoute'));

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});

// Manipuladores de eventos de conexão de banco de dados
database.on('error', (error) => {
  console.log('Database Connection Error:', error);
});

database.once('connected', () => {
  console.log('Banco de dados conectado.');
});