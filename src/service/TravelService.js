const TravelRepository = require('../repository/TravelRepository');
const { errors } = require("config");
const logger = require('../../winston');

class TravelService {
  findTravels(userId) {
    return TravelRepository.findTravelsByUserId(userId);
  }


}

module.exports = new TravelService();