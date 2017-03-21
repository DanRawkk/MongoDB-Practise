//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
/* Esta libreria nos permite coenctarnos a nuestra BD */


/* Para coenctarnos a nuestra base de datos usamos
'MongoClient.connect()' que recive 2 parametros. El primero en una string
donde ira la ubicacion de neustra BD mongo. Y siempre se usa el protocolo
'mongodb://' y en este caso que nos coenctamos a nuestra direccion local
usamos 'localhost:27017' seguido de la base de datos a la que nos queremos
conectar que en este caso sera "/TodoApp". Esta podria ser una BD donde sea
como amazon, heroku u otros.
  De segundo argumento recive un "callback" que se lansara una ves que se logre
establecer conexion o que falle. Como primer parametro recive el "Error" si es
que hay y de segundo recibe "db" que es el que usaremos para "leer" y "escribir"
informacion.
  En Mongo no nesecitamos crear las BDs primero, vasta con ponerlo en el
"connect",y empesar a agregar datos para que se cree automaticamente y
este lista para usarse.
*/
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to MongoBD server.');
    return;
  }
  console.log('Connected to Mongo DB server.');

  /* Con 'db.collection("colleccion a elegir")' elegimos que colleccion queremos
  usar y ya de ahi podemos decidir que queremos hacer con ella.
      Usamos el metodo '.find()' para buscar un objeto o campo como se llame
  pero al no pasarle ningun parametro nos regresara todo en la colleccion. O
  podemos pasarle un objeto con las propiedades que buscamos y nos regresará
  los que tengan esas propiedades.
      Usamos 'toArray()' metera en un array todo lo que nos retorne. Tambien nos
  retorna una promise para manejar el error o lo que recibimos.
      Para buscar por '_id' no es solo copiar y pegar el id porque es un objeto
  compuesto, entonces tenemos que usar el 'ObjectID' para hacer el query.
  */
  db.collection('Todos').find({
    _id: new ObjectID('58cb64808218762486cffa2c')
  }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  //db.close();
});
