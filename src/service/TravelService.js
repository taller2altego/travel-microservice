const TravelRepository = require('../repository/TravelRepository');
const { errors } = require("config");
const logger = require('../../winston');
const {
  TravelNotFound,
  wrongPassword,
  TravelAlreadyExists,
  unableToMatchEmail
} = errors;

const buildError = (objectMessage) => {
  const err = new Error();
  err.statusCode = objectMessage.statusCode;
  err.message = objectMessage.message;
  throw err;
};

class TravelService {
  async signUp(body) {
    return TravelRepository.findTravelByEmail(body.email)
      .then(Travel => {
        logger.debug(typeof (Travel));
        if (Travel === null) {
          return TravelRepository.signUp(body);
        }
        buildError(TravelAlreadyExists);
      });
  }

  async login(queryParams) {
    console.log(queryParams);
    return this
      .findAllTravels(queryParams)
      .then(response => {
        console.log(response);
        if (!response.length) {
          return buildError(TravelNotFound);
        } else if (response[0].password != queryParams.password) {
          return buildError(wrongPassword);
        } else {
          return response;
        }
      });
  }

  findAllTravels(queryParams) {
    return TravelRepository.findAll(queryParams);
  }

  findTravelById(id) {
    return TravelRepository.findById(id)
      .catch((err) => {
        return buildError(TravelNotFound);
      });
  }

  verifyTravelByEmail(email) {
    return TravelRepository.findTravelByEmail(email)
      .then((Travel) => {
        if (Travel === null) {
          return buildError(TravelNotFound)
        }
      })
      .catch(() => {
        return buildError(TravelNotFound);
      });
  }

  patchTravelById(id, body) {
    return this.findTravelById(id)
      .then(() => {
        return TravelRepository.patchById(id, body);
      });
  }

  patchTravelByEmail(email, body) {
    return TravelRepository.findTravelByEmail(email)
      .then(() => {
        return TravelRepository.patchByEmail(email, body);
      });
  }

  removeTravelById(id, email) {
    return this.findTravelById(id)
      .then((Travel) => {
        console.log(email);
        console.log(Travel);
        if (email === Travel.email) {
          return TravelRepository.removeById(id);
        }
        return buildError(unableToMatchEmail);
      });
  }

  changePasswordByEmail(email, newPassword) {
    return this.patchTravelByEmail(email, { "password": newPassword });
  }
}

module.exports = new TravelService();