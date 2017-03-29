const {ObjectID} = require('mongodb');
/* El 'ObjectID' a parte de ayudarnos a hacer querys con el 'id' Tambien
tiene otras funciones como en este caso lo usaremos para validar si la 'id'
ingresada, es valida. */

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '58d07f0f1fa22c426813cd64';

/* NOTA: Si el id que ingresamos no existe, no nos retornara un error,
lo que ara es que nos retornará:
  '.find()': []
  '.findOne()': null
  '.findById()': null
Entonces lo mejor que podemos hacer es poner un 'if' que maneje si el resultado
retornado es null o un array basio y que diga que no se encontró.

  Pero si el 'id' que ingresamos esta mal, como que sea mas largo o que se yo.
Nos enviara un grave error. y ya sea que lo manejemos con un '.carch()' o
decidamos validar el id primero si es que esta bien antes de proseguir.
*/

//Comprovamos si el id es vaido.
if(!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

/* '.find' busca y te retorna todos los resultados que encajen con el parametro
ingresado dentro de un array, en este caso pusimos un id asi que solo retornara
uno, pero si por ejemplo ponemos alguna propiedad dondepuedan ser tru o false,
nos regresaria todos losque tengan ese que espesificamos. */
Todo.find({ _id: id })
  .then((todos) => {
    console.log('Todos', todos);
  });

/* '.findOne' lo que hace es que en ves de traerte todos los que encajen en un
array, solo te regresa el primero que encuentre con esas caracteristicas como un
objeto (sin array).
  Si queremos encontrar algun documento por algo que no sea su 'id', es mas
acosejable usar '.findOne'.*/
Todo.findOne({ _id: id })
  .then((todo) => {
    if (!todo) {
      return console.log('Todo not found');
    }
    console.log('Todos', todo);
  });


/* Lo que este query hace es que solo ingresamos el id y directamente busca por
'id' sin tnerle que poner el '{ _id: id }'.
  Si lo que queremos es buscar a traves del 'id' mejor usar este que '.findOne'
*/
Todo.findById(id)
  .then((todo) => {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log('Todo By Id ', todo);
  });
