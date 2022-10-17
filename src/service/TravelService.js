const TravelRepository = require('../repository/TravelRepository');
const { errors } = require("config");
const logger = require('../../winston');

class TravelService {
  findTravels(userId, query) {
    return TravelRepository.findTravelsByUserId(userId, query);
  }


}

module.exports = new TravelService();