const validatetravel = require('../controller/travel/TravelValidate');
const TravelController = require('../controller/travel/TravelController');
const logger = require('../../winston');

const router = require('express').Router();

module.exports = app => {

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  const logInput = (req, res, next) => {
    logger.info(JSON.stringify(req.body, undefined, 2));
    logger.info(JSON.stringify(req.query, undefined, 2));
    next();
  };

  app.use('/', router);
  router.get('/travels/users/:userId', logInput, TravelController.findTravelsByUserId, handlerResponse);
  router.get('/travels', logInput, TravelController.findTravels, handlerResponse);
  router.get('/travels/:travelId', logInput, TravelController.findTravel, handlerResponse);
  router.get('/travels/:travelId/driver', logInput, TravelController.checkDriverConfirmation, handlerResponse);

  router.post('/travels', logInput, TravelController.createTravel, handlerResponse);
  router.patch('/travels/:travelId', logInput, TravelController.patchTravel, handlerResponse);
  router.post('/travels/:travelId/accept', logInput, TravelController.acceptTravel, handlerResponse);
  router.post('/travels/:travelId/reject', logInput, TravelController.rejectTravel, handlerResponse);
  router.post('/travels/:travelId/start', logInput, TravelController.startTravel, handlerResponse);
  router.post('/travels/:travelId/finish', logInput, TravelController.finishTravel, handlerResponse);

  // router.get('/driver/:driverId/travels', TravelController.find(), handlerResponse);
  // router.get('/travel/states', TravelController.find(), handlerResponse);
  // router.get('/travel/price', TravelController.find(), handlerResponse);
  // router.put('/travels/:travelId', TravelController.find(), handlerResponse);
};