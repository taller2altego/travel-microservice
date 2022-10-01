const TravelService = require('../../service/TravelService');

class TravelController {
  signUp(req, res, next) {
    return TravelService.signUp(req.body, req.params.id)
      .then(Travel => {
        const { password, ...response } = Travel;
        res.customResponse = { statusCode: 201, ...response };
        next();
      })
      .catch((err) => {
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  }

  async login(req, res, next) {
    console.log(req.query);
    return TravelService.login(req.query)
      .then(Travels => {
        const data = Travels.map(({ password, ...r }) => r);
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        console.log()
        res.customResponse = { statusCode: err.statusCode, message: err.message };
        next();
      });
  }

  async findAllTravels(req, res, next) {
    return TravelService.findAllTravels(req.query)
      .then(Travels => {
        const data = Travels.map(({ password, ...r }) => r);
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        res.customResponse = { statusCode: err.statusCode, message: err.message };
        next();
      });
  }

  async findTravelById(req, res, next) {
    console.log(req);
    return TravelService.findTravelById(req.params.id)
      .then(Travel => {
        const { password, ...response } = Travel;
        res.customResponse = { statusCode: 200, ...response };
        next();
      })
      .catch((err) => {
        console.log(err);
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  }

  async verifyTravelByEmail(req, res, next) {
    console.log(req);
    return TravelService.verifyTravelByEmail(req.body.email)
      .then(() => {
        res.customResponse = { statusCode: 200 };
        next();
      })
      .catch((err) => {
        console.log(err);
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  }



  async patchTravelById(req, res, next) {
    return TravelService.patchTravelById(req.params.id, req.body)
      .then(() => {
        res.customResponse = { statusCode: 201 };
        next();
      })
      .catch((err) => {
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  }

  async removeTravelById(req, res, next) {
    return TravelService.removeTravelById(req.params.id, req.body.email)
      .then(() => {
        res.customResponse = { statusCode: 204 };
        next();
      })
      .catch((err) => {
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  }

  async changePasswordByEmail(req, res, next) {
    return TravelService.changePasswordByEmail(req.body.Travelname, req.body.newPassword)
      .then(() => {
        res.customResponse = { statusCode: 204 };
        next();
      })
      .catch((err) => {
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  }



}

module.exports = new TravelController();