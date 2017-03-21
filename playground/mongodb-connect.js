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

  // db.collection('Todos').insertOne({
  //   text: 'Some tesxt',
  //   completed: false
  // },(err, result) => {
  //   if (err) {
  //     console.log('Unable to insert todo. ',err );
  //     return;
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'Sofia',
    age: 21,
    location: 'Somewhere'
  },(err, result) => {
    if (err) {
      console.log('Unable to insert user. ',err );
      return;
    }

    console.log(JSON.stringify(result.ops));
  });

  console.log('Connected to Mongo DB server.');
  db.close();
});
