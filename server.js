const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require('morgan');
const logger = require('./winston');

mongoose
  .connect(process.env.MONGOATLAS_URI || 'mongodb://mongo:27017/docker-node-mongo', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const myStream = {
  write: text => {
    logger.info(text);
  }
};
app.use(morgan('combined', { stream: myStream }));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Travel Microservice",
    description: "API del microservicio de viajes",
    version: "0.1",
  },
  servers: [{ url: "http://localhost:5003", description: "" }]
};

const options = { swaggerDefinition, apis: ["./docs/**/*.yaml"] };
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

require("./src/routes/TravelRoutes")(app);

app.listen(process.env.PORT || 5000, () => console.log('is connected'));

module.exports = app;

// const express = require('express');
// const mongoose = require('mongoose');
// const Travels = require('./models/travels');

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// function validateDriverRules(body) {
//   return body;
// }

// mongoose
//   .connect(
//     'mongodb://mongo:27017/docker-node-mongo',
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// app.get('/user/:userId/travels', (req, res) => {
//   const userId = req.params.userId;
//   return Travels.find().where('userId').equals(userId)
//     .then(user => res.status(200).send(user))
//     .catch(err => res.status(404).json({ msg: 'No items found' }));
// });

// app.get('/driver/:driverId/travels', (req, res) => {
//   const userId = req.params.driverId;
//   return Travels.find().where('driverId').equals(userId)
//     .then(driver => res.status(200).send(driver))
//     .catch(err => res.status(404).json({ msg: 'No items found' }));
// });

// // Reglas:
// // Las reglas se validarán en este orden y se considerará como válida la primera regla que matchee.
// // Se crea un viaje a un usuario.
// // Se asigna un chofer null y un estado buscando chofer. Cualquier otro estado será considerado inválido, lo mismo el chofer.
// app.post('/travels', async (req, res) => {
//   try {
//     const currentTravel = req.body;
//     const userId = currentTravel.userId;

//     const newUserTravel = new Travels({ userId, travels: [currentTravel] });
//     return newUserTravel
//       .save()
//       .then(_createdUserTravel => res.status(200).send('ok'));

//   } catch (err) {
//     console.log(err);
//     res.status(500).send('roto');
//   }
// });

// app.get('/travel/states', async (req, res) => {
//   res.status(200).send({ status: ["looking", "waiting", "canceled", "finished"] })
// });

// // Se recibirá source y destination y se calculará el precio
// app.get('/travel/price', async (req, res) => {
//   res.status(200).send({ price: 1000 });
// });

// // Reglas:
// // Las reglas se validarán en este orden y se considerará como válida la primera regla que matchee.
// // Si llega un query param driverId y el estado del viaje es buscando conductor o suspendido se confirmará el viaje con el conductor asignado. En otro caso se arrojará un bad request diciendo que no puede cambiarse el conductor.
// // State puede tomar los valores "looking", "waiting", "canceled", "finished".
// // La confirmación del viaje se dará con el state correspondiente en el body. Y initial_duration deberá iniciar con la fecha actual.
// // Si un viaje pasa a estados waiting o finished el driverId y initial_duration deben ser null devuelta.
// // Cuando el estado sea finished se podrá actualizar el valor de duration como la resta entre la fecha actual y initial_duration
// // Source, destination, duration, price, 
// app.put('/travels/:travelId', async (req, res) => {
//   const travelId = req.params.travelId;

//   const body = validateDriverRules(req.body);

//   return Travels.updateOne({ travelId }, body);
// });

// const port = 3000;
// app.listen(port, () => console.log('Server running...'));

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const TravelSchema = new Schema({
//   price: {
//     type: Number,
//     required: true
//   }
// });

// const TravelsSchema = new Schema({
//   userId: {
//     type: Number,
//     required: true
//   },
//   driverId: {
//     type: Number,
//     required: false,
//   },
//   travel: TravelSchema
// });

// const Travels = mongoose.model('travels', TravelsSchema);

// module.exports = Travels;