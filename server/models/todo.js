const mongoose = require('mongoose');

/* Con Mongoose podemos crear modelos de los documentos que estaremos ingresando
a nuestra DB; que campos tendra, de que tipo son, si son requeridos o no y otras
cuantas cosas mas que dice en su documentacion.
  src: http://mongoosejs.com/docs/models.html
*/

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1, //Dice que por lo menos deve ser de 1 de largo para pasar
    trim: true //Quita cualqueir espacio en blanco al inicio y final del texto
  },
  completed: {
    type: Boolean,
    default: false //Con este decimos cual es su valor inicial por default
  },
  completedAt: {
    type: Number,
    default: null
    /*Como completedAtmuestra la hora en la que fue completada, y por default
    no puede estar compeltada, entonces ponemos que por default es null.*/
  }
});

module.exports = {Todo};

/* Una ves echo el modelo podemos crear nuevos documentos a partir de este modelo.
  Aunque en este caso como no emos puesto que los demas campos son requeridos,
es suficiente con poner un campo. Aunque crear uno nuevo no ara que se guarde
en la DB. */
// const newTodo = new Todo({
//   text: 'Study node and react.'
//   /* Como ya emos puesto valores por default para los otros campos, entonces
//   ya no es nesesario que los mandemos, porque se pondran solos. Ahora solo es
//   suficiente con mandar un texto. */
//   // completed: true,
//   // completedAt: 10012017
// });

/* Para guardarla en la DB se usa el metodo '.save()' que nos regresa una
Promise para decidir que aremos cuando se guarde pasandonos el obj guardado
o si ocurre un error. */
// newTodo.save().then((doc) => {
//   console.log(`Saved todo: ${doc}`);
// }, (err) => {
//   console.log('Unable to save Todo.');
// });
