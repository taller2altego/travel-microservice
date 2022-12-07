// const validatetravel = require('../controller/TravelValidate');
const router = require('express').Router();

const logger = require('../../winston');
const FeeController = require('../controller/fee/FeeController');

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
  router.get('/fees', logInput, FeeController.findFees, handlerResponse);
  router.get('/fees/:feeId', logInput, FeeController.findFee, handlerResponse);
  router.post('/fees', logInput, FeeController.createFee, handlerResponse);
  router.patch('/fees/:feeId', logInput, FeeController.patchFee, handlerResponse);

  router.get('/price', logInput, FeeController.getPrice, handlerResponse);
};
