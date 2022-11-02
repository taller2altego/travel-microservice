// const validatetravel = require('../controller/TravelValidate');
const logger = require('../../winston');
const FeeController = require('../controller/fee/FeeController');

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
  router.get('/fees', logInput, FeeController.findFees, handlerResponse);
  router.get('/fees/:feeId', logInput, FeeController.findFee, handlerResponse);
  router.post('/fees', logInput, FeeController.createFee, handlerResponse);
  router.patch('/fees/:feeId', logInput, FeeController.patchFee, handlerResponse);
};