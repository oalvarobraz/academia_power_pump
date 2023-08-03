require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/database');

// Conexão com o banco de dados MongoDB
connectDB();

const app = express(); // Criação da instância do aplicativo do framework Express

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração dos middlewares globais
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(methodOverride('_method'));

// Importação e utilização das rotas do aplicativo
app.use('/', require('./routes/mainRoute'));
app.use('/', require('./routes/adminRoute'));
app.use('/', require('./routes/personalRoute'));

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});