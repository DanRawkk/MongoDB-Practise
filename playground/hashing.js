const {SHA256} = require('crypto-js');
const jwt = required('jsonwebtoken');
const bcrypt = require('bcryptjs');
/* NOTA: Este ejemplo es solo para demostrar en resumen como es la autenticacion.
En la verdadera app no usaremos esta libreria sino JWT (JasonWebToken) que soporta
todas estas funciones que aqui se demuestran. */

const pass = 'hi123';

/* Con bcryptjs vamos a hacerle hash y saltear las contraseñas.
Primero le crearemos un 'Salt' de 10 de largo y le pasaremos una funcion que
recibira el salteo y el error y dentro de esta funcion ya hacemos el hash con el
salteo. */
bcrypt.getSalt(10, (err, salt) => {
    bcrypt.hash(pass, salt, (err, hash) => {
        console.log(hash);
    });
});

const message = 'Hi :3';
const hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

const data = {
  id: 574186
};

/* Para crear un token le pasaremos por ej en este caso el 'id' del usuario y
algun tipo de valor aleatorio despues del JSON que cambiara en cada cierto tiempo,
Esto ara que aunque el usuario pudiera saber su 'id' no sabria el valor secreto
que va despues del JSON, y esto lo pasamos por el SHA256.  Esto imposivilita
ser vulnerados. */
const token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'secretValues').toString();
}// El echo de pasar un value secreto se llama 'salt'

const resultHash = SHA256(JSON.stringify(token.data) + 'secretValues').toString();

if (resultHash === token.hash) {
  console.log('Data is safe');
} else {
  console.log('Data was changed. Do not trust!');
}
