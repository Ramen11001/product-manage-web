const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors({
    origin: 'http://localhost:4200', // Permitir solicitudes desde tu web en Angular
    methods: ['GET', 'POST'],  //  Permitir métodos GET y POST
    allowedHeaders: ['Content-Type', 'Authorization'] //  Permitir headers comunes
}));

app.use(express.json());



app.listen(3000, () => {
    console.log('Servidor API en http://localhost:3000');
});