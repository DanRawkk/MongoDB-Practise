const {ObjectID} = require('mongodb');
/* El 'ObjectID' a parte de ayudarnos a hacer querys con el 'id' Tambien
tiene otras funciones como en este caso lo usaremos para validar si la 'id'
ingresada, es valida. */

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

/* Mongoose nos da 3 maneras de eliminar documentos. La primera es con '.remove()'
que a diferencia de '.find()' no le puedes pasar el parentesis bacio y que te
regrese (en este caso que te elimine) todos los archivos. Para eso deves de
pasarle un objeto bacio y te eliminiara todo '.remove({}).then....'
  El resultado te retornara un objeto con mucha informacion (no te regresa los
elementos eliminados) y en ese objeto te retorna {result: {ok:1, n:3}}
donde 1 significa que se borro exitosamente y 'n' la cantidad de elementos
eliminados.
*/
Todo.remove({}).then((result) => {
  console.log(reult);
});

/* '.findOneAndRemove()' eliminara el primer elemento que encuentre con el
argumento pasado y nos retornara el objeto eliminado para que lo pudamos usar. */
Todo.findOneAndRemove({/*some arguments*/}).then((todo) => {
  console.log(todo);
});

/* '.findByIdAndRemove()' eliminara el elemento con el id que le pasemos
 y nos retornara el objeto eliminado para que lo pudamos usar. */
Todo.findByIdAndRemove('algun id aqui').then((todo) => {
  console.log(todo);
});
