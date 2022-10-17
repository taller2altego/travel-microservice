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

  setDriverByTravelId(travelId, driverId) {
    return TravelRepository.setDriverByTravelId(travelId, driverId);
  }

  patchTravel(travelId, body) {
    if (body.driverId) {
      return this.setDriverByTravelId(travelId, body.driverId);
    }

    return TravelRepository.patchTravel(travelId, body);
  }

  checkDriverConfirmation(travelId) {
    return TravelRepository.checkDriverConfirmation(travelId);
  }

}

module.exports = new TravelService();