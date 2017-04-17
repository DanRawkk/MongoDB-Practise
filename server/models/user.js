const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
/*Bcryptjs source:
https://www.npmjs.com/package/bcryptjs
*/

/* Creamos un 'Schema' que nos permitirá crear nuevas instancias de este modelo.
A su ves tambien le podremos agregar metodos que eredarán las nuevas instancias. */

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    unique: true, // Decimos que en la base de datos este tiene que ser unico
    validate: {
      // El 'validate' le pasa el valor del email a esta prop para validarlo.
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    /* Los tokens serviran para diferentes cosas asi que tendremos mas de 1 en
     la array, asi que creamos un array y configuramos como sera cada token.*/
    token: {
      type: String,
      required: true
    }
  }]
});

/* Este metodo lo creamos porque cuando regresamos al usuario no queremos que
le retorne toda la informacion como su token y su contraseña (en el body) y solo
queremos que reciba su email y su id. Y el token lo reciba solo en el header.  */
UserSchema.methods.toJSON = function() {
  const user = this;
  //Convertimos 'user' en un objeto que podamos maipular.
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

// Usamos una funcion normal porque las de flecha no se 'bidean' al this.
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  /* En token usamos "jwt.sign({}, '')" que como primer argumento le pasamos el
  objeto que queremos codificar y de segundo alguna cadena para que no sea facil
  de burlar la autenticacion, en caso de que intenten mandarnos informacion.
    Despues lo que nos regrese lo pasaremos a 'toString' para que nos regrese el
  token como cadena. */
  const token = jwt.sign({
    _id: user._id.toHexString(),
    access: access
  }, 'abc123').toString();

  /* Con esto accedemos a la nueva instancia de cada usuario y le inyecta el
  nuevo token creado y el 'access' */
  user.tokens.push({access, token});

  /* Una ves creado el usuario lo gravamos en la BD y al guardarlo se regresa
  una Promesa. Esta promesa lo que ara sera regresarnos el token. */
  return user.save().then(() => {
    return token;
  });
}

UserSchema.statics.findByToken = function(token) {
  const User = this; //Este va ligado al modelo y no a la instancia de 'usuario'
  /*Esta ira sin definir porque asi como nos puede regresar
  el resultado decodificado, tambien nos puede retornar el error*/
  let decoded;
  /* El bloke 'try catch' lo que hace es que prueba el codigo que esta en 'try'
  y si nos da un error se detiene y pasa de imediato a catch que manejara el
  error y nos retornara algo sin tener que detener el programa. */
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    /* En caso de fallar retornamos una Promise que nos mande reject para que
    no siga corriendo el codigo y podamos manejar la Promise con 'catch' */
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
    /* Esto es lo mismo que el codigo de arriba pero mas simplificado, hace
    exactamente lo mismo, tambien si queremos podemos pasarle un argumento a
    'reject' que sera el mensaje que agarrara el 'catch(e)' y nos imprimirá. */
  }
  /* Despues de decodificar haremos una busqueda con 'findOne' con las propiedades
  del objeto decodificado.
    Al tener que sacar propiedades anidadas, entonces lo ponemos entre comillas
  para que podamos acceder a ellos, y en este caso apra que no desentone el id tmb.
   */
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;
  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

/* Para encriptar las contraseñas se ara antes de ser guardadas en la BD.
Para hacer eso debemos de usar los middlewares de mongoose que nos permiten
hacer acciones en diferentes momentos, en este caso sera antes de guardar.
  A la funcion le tenemos que pasar el 'next' y correr este en algun momento
de la funcion o nunca terminara de correr el middleware y se quedara estancado
ahí.

  Este midleware correra cada ves que un usuario se vaya a guardar, lo que
significa que si el usuario modifica algun dato como su email, este middleware
correra de nuevo, y si solo se modifico el email y la contraseña no (osea que la
contraseña sigue encryptada) la contraseña se volvera a encriptar. lo que causaria
una doble encryptacion  y por consiguiente un error.
  Entonces lo que tenemos que hacer es preguntar si la contraseña a sido
modificada o no, y si a sido modificada entonces la encryptamos y si no a sido
modificada entonces la dejamos como esta. Para eso usaremos 'user.isModified'
que nos dira si el campo que le pasamos a sido modificado.
src: http://mongoosejs.com/docs/middleware.html */
UserSchema.pre('save', function (next) {
  const user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
