const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config')

//*crear el server de express

const app = express();

//* base de datos

dbConnection();

//CORS
app.use(cors())

//*directorio publico
app.use(express.static('public'));

//*Lectura y parseo del body

app.use(express.json());

//*Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html')
})

//* Escuchar peticiones

app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});