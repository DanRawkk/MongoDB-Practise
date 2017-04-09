const {User} = require('./../models/user');

/* Este sera el 'MIDLEWARE' que ara nuestras rutas anonimas. */
const authenticate = (req, res, next) => {
  const token = req.header('x-auth');
  User.findByToken(token)
    .then((user) => {
      if(!user) {
        /* En caso de que el token sea valido pero por alguna razon no pueda
        retornar los valores, retornaremos un error con un 'Promise.reject' que
        nos mandara directo al 'catch' */
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      next();//Para que el codigo que le sigue se pueda seguir ejecutando.
    })
    .catch((err) => {
      res.status(401).send();
    });
}

module.exports = {authenticate};
