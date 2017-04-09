const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
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

module.exports = {User};
