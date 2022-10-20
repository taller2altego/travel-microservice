const validatetravel = require('../controller/travel/TravelValidate');
const TravelController = require('../controller/travel/TravelController');

const router = require('express').Router();

module.exports = app => {

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  app.use('/', router);
  router.get('/travels/users/:userId', TravelController.findTravelsByUserId, handlerResponse);
  router.get('/travels', TravelController.findTravels, handlerResponse);
  router.get('/travels/:travelId', TravelController.findTravel, handlerResponse);
  router.get('/travels/:travelId/driver', TravelController.checkDriverConfirmation, handlerResponse);

  router.post('/travels', TravelController.createTravel, handlerResponse);
  router.patch('/travels/:travelId', TravelController.patchTravel, handlerResponse);

  // router.get('/driver/:driverId/travels', TravelController.find(), handlerResponse);
  // router.get('/travel/states', TravelController.find(), handlerResponse);
  // router.get('/travel/price', TravelController.find(), handlerResponse);
  // router.put('/travels/:travelId', TravelController.find(), handlerResponse);
};