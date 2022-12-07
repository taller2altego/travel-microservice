const router = require('express').Router();

const TravelController = require('../controller/travel/TravelController');
const logger = require('../../winston');

module.exports = app => {
  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    logger.info(`response: ${JSON.stringify(otherFields, undefined, 2)}`);
    res.status(statusCode).send(otherFields);
  };

  const logInput = (req, res, next) => {
    if (req.query) {
      logger.info(`query: ${JSON.stringify(req.query, undefined, 2)}`);
    }

    if (req.params) {
      logger.info(`params: ${JSON.stringify(req.params, undefined, 2)}`);
    }

    if (req.body) {
      logger.info(`body: ${JSON.stringify(req.body, undefined, 2)}`);
    }
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
};
