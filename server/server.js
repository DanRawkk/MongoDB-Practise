const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

/* Agregamos un midleware que ara es que transformara el body de los request
de text a json. */
app.use(bodyParser.json());


/******************************************************************************/
/* Creamos la ruta para crear nuevos todos */
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
    /* En caso de error podemos solo enviar el error "res.send(err)" pero Tambien
    podemos elegir cual estatus de error, enviar, en este caso elejimos el 400 */
  });
});
/******************************************************************************/
/* Con este pediremos todos los posts */
app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    /* La respuesta nos mandara un array de los todos. y auqnue podriamos solo
    resivirlo y enviarlo asi "res.send(todos)" no es la mejor forma porque si
    queremos agregarle mas configuraciones como el status code y esas cosas, no
    se podra, asi qe mejor lomandamos en un objeto {todos: todos} y asi si lo
    deseamos podemos ponerle mas propiedades al objeto como su estatus y mas. */
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

/******************************************************************************/

/* Lo que aqui se ve esta mejor explicado en /playground/mongoose-queries.js */
app.get('/todos/:id', (req, res) => {
  /* En 'req.params' se encuentran los parametros que pasamos al url con el 'key'
  que nostros escribimos arriba, en este caso "id". Osea que lo que pasemos
  despues de '/todos/' se convertira en nuestro  parametro 'id' */
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(400).send();
      }
      res.send({todo});
    })
    .catch((e) => {
      return res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(400).send();
      }
      res.send({todo});
    })
    .catch((e) => {
      return res.status(400).send();
    });

});

/******************************************************************************/
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
