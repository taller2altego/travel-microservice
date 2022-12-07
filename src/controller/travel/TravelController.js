const logger = require('../../../winston');
const TravelService = require('../../service/TravelService');
const handlerResponse = require('../../utils/handlerResponse');

class TravelController {
  findTravels(req, res, next) {
    const { latitude, longitude, token } = req.query;
    return TravelService.findTravels([longitude, latitude], token)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  findTravel(req, res, next) {
    return TravelService.findTravel(req.params.travelId)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  findTravelsByUserId(req, res, next) {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query;

    return TravelService.findTravelsByUserId(userId, { page: Number.parseInt(page), limit: Number.parseInt(limit) })
      .then(travel => {
        res.customResponse = { statusCode: 200, ...travel };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  createTravel(req, res, next) {
    const body = req.body;
    return TravelService.createTravel(body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }


  acceptTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .acceptTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel accepted' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  rejectTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .rejectTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel rejected' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  startTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .startTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel started' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  finishTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .finishTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel finished' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  patchTravel(req, res, next) {
    const travelId = req.params.travelId;
    const body = req.body;
    return TravelService
      .patchTravel(travelId, body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 201 };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  checkDriverConfirmation(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .checkDriverConfirmation(travelId)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }
}

module.exports = new TravelController();