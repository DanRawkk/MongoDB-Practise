const mongoose = require('mongoose');
/*
src: http://mongoosejs.com/
*/

mongoose.Promise = global.Promise;
/* Esto se hace siempre antes de inicialisar la coneccion con la base de datos
para decir que usaremos el sistema de Promises que tiene node. Si queremos usar
otro modulo de promises, aqui es donde se le asigna. Mongoose por defecto
trabaja con callbacks asi que para que pueda usar promises se aplica esta */

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
/* La diferencia entre mongoose y mongodb es que mongodb al conectarse tiene un
segundo parametro al que se le pasa un callback y todo el resto del codigo va
dentro de ese callback. Mientras que en mongoose mantiene esta conexion en el
tiempo */

/* Ponemos toda nuestra configuracion en un archivo y lo exportamos para usarlo */
module.exports = {mongoose};
