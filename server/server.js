const _ = require('lodash');
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
/******************************************************************************/
/* Con patch lo que aremos sera hacer updates a nuestros post. */
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  /* En el caso de hacer un 'update' queremos que el usuario solo pueda acceder
  a las caracteristicas que queremos del objeto y no a todos como en este caso
  al 'id' o a la fecha de completado. Entonces usamos '_.pick()' que lo que hace
  es que le pasamos un objeto completo como primer argumento y de segundo
  argumento pasamos un array de las propiedades que le queremos sacar y nos
  retorna un objeto con esas unicaspropiedades, en este caso solo queremos que
  pueda modificar el texto y si a sido completado.
  src: https://lodash.com/docs/4.17.4#pick */
  const body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  /* En caso de que el 'todo' no se modifique el texto y solo se modifique si se
  completó checaremos si nuestro la propiedad 'completed' es un boolean y si es
  true agregaremos una nueva propiedad al objeto que sera la fecha de completado.
  */
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();// Hora que fue completado
  } else {//En caso de ponerlo como no completado
    body.completed = false;
    body.completedAt = null;// Se borra la hora de completado
  }
  /* El '.findByIdAndUpdate(id, update, options, callback )' recive 4 parametros
  aunque minimo puede recibir "id y update".

    Como ya sabemos id es el id del documento a modificar.

    En 'update' se le pasan los campos que seran modificados con el contenido
  que sera modificado con un objeto:
  {$set: {key: valueModified, key2: valueModified}} usando '$set' para decir que
  esas son las propiedadesque seran modificadas, en este caso pasaremos el objeto
  'body'.

    En 'options' Tambien se le pasa un objeto con las sigientes opciones:
  -new: bool - true to return the modified document rather than the original. defaults to false
  -upsert: bool - creates the object if it doesn't exist. defaults to false.
  -runValidators: if true, runs update validators on this command. Update validators validate the update operation against the model's schema.
  -setDefaultsOnInsert: if this and upsert are true, mongoose will apply the defaults specified in the model's schema if a new document is created. This option only works on MongoDB >= 2.4 because it relies on MongoDB's $setOnInsert operator.
  -sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
  -select: sets the document fields to return

    Y en el 'callback' lo que queremos que aga al finalisar.

  src: http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate */
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true, runValidators: true})
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((err) => {
      res.status(400).send();
    });
});

/******************************************************************************/
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
