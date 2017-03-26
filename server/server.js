const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

/* Agregamos un midleware que ara es que transformara el body de los request
de text a json. */
app.use(bodyParser.json());

/* Creamos la ruta para crear nuevos todos */
app.post('/todos', (req, res) => {
  console.log(req.body);
});

app.listen(3000, () => {
  console.log('Listening on port: 3000');
});
