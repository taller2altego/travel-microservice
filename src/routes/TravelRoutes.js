const validatetravel = require('../controller/travel/TravelValidate');
const TravelController = require('../controller/travel/TravelController');

const router = require('express').Router();

module.exports = app => {

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  app.use('/', router);
  router.post('/travels', TravelController.createTravel, handlerResponse);
  router.get('/travels/:userId', TravelController.findTravel, handlerResponse);
  // router.get('/driver/:driverId/travels', TravelController.find(), handlerResponse);
  // router.get('/travel/states', TravelController.find(), handlerResponse);
  // router.get('/travel/price', TravelController.find(), handlerResponse);
  // router.put('/travels/:travelId', TravelController.find(), handlerResponse);
};