const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var User = mongoose.model('User', UserSchema);

module.exports = {User};
