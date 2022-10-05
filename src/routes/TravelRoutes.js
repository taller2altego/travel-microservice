const validatetravel = require('../controller/travel/TravelValidate');
const travel = require('../controller/travel/TravelController');

const router = require('express').Router();

module.exports = app => {

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  app.use('/travels', router);
  router.get('/', travel.findAlltravels, handlerResponse);
  router.get('/:travelId', travel.findAllDrivers, handlerResponse);
  router.post('/', validatetravel, travel.associateDriverTotravel, handlerResponse);
  router.patch('/:travelId', travel.patchDriverById, handlerResponse);
};