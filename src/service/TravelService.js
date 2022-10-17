const TravelRepository = require('../repository/TravelRepository');
const { errors } = require("config");
const logger = require('../../winston');

class TravelService {
  findTravels(userId, query) {
    return TravelRepository.findTravelsByUserId(userId, query);
  }

  createTravel(body) {
    return TravelRepository.createTravel(body);
  }

}

module.exports = new TravelService();