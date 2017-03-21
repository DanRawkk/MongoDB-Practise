const mongoose = require('mongoose');
/*
src: http://mongoosejs.com/
*/

mongoose.Promise = global.Promise;
/* Esto se hace siempre antes de inicialisar la coneccion con la base de datos
para decir que usaremos el sistema de Promises que tiene node. Si queremos usar
otro modulo de promises, aqui es donde se le asigna. Mongoose por defecto
trabaja con callbacks asi que para que pueda usar promises se aplica esta */

mongoose.connect('mongodb://localhost:27017/TodoApp');
/* La diferencia entre mongoose y mongodb es que mongodb al conectarse tiene un
segundo parametro al que se le pasa un callback y todo el resto del codigo va
dentro de ese callback. Mientras que en mongoose mantiene esta conexion en el
tiempo */


/* Con Mongoose podemos crear modelos de los documentos que estaremos ingresando
a nuestra DB; que campos tendra, de que tipo son, si son requeridos o no y otras
cuantas cosas mas que dice en su documentacion.
  src: http://mongoosejs.com/docs/models.html
*/
const Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

/* Una ves echo el modelo podemos crear nuevos documentos a partir de este modelo.
  Aunque en este caso como no emos puesto que los demas campos son requeridos,
es suficiente con poner un campo. Aunque crear uno nuevo no ara que se guarde
en la DB. */
const newTodo = new Todo({
  text: 'Go walk'
});

/* Para guardarla en la DB se usa el metodo '.save()' que nos regresa una
Promise para decidir que aremos cuando se guarde pasandonos el obj guardado
o si ocurre un error. */
newTodo.save().then((doc) => {
  console.log(`Saved todo: ${doc}`);
}, (err) => {
  console.log('Unable to save Todo.');
})
