const logger = require('../../../winston');
const FeeService = require('../../service/FeeService');
const handlerResponse = require('../../utils/handlerResponse');

class FeeController {
  findFees(req, res, next) {
    const { page = 1, limit = 10 } = req.query;
    return FeeService.findFees(Number.parseInt(page), Number.parseInt(limit))
      .then(fees => {
        res.customResponse = { statusCode: 200, ...fees };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  findFee(req, res, next) {
    return FeeService.findFeeById(req.params.feeId)
      .then(fee => {
        res.customResponse = { statusCode: 200, data: fee };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  createFee(req, res, next) {
    const body = req.body;
    return FeeService.createFee(body)
      .then(fee => {
        res.customResponse = { statusCode: 200, data: fee };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  patchFee(req, res, next) {
    const feeId = req.params.feeId;
    const body = req.body;
    return FeeService
      .patchFee(feeId, body)
      .then(() => {
        res.customResponse = { statusCode: 201 };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  getPrice(req, res, next) {
    return FeeService.getPrice(req.query)
      .then(price => {
        res.customResponse = { statusCode: 200, data: price };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }
}

module.exports = new FeeController();