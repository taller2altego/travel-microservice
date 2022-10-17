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
    return TravelRepository.patchTravel(travelId, { driverId });
  }

  updateDriverPosition(travelId, currentDriverPosition) {
    return TravelRepository.patchTravel(travelId, { currentDriverPosition });
  }

  patchTravel(travelId, body) {
    if (body.driverId) {
      return this.setDriverByTravelId(travelId, body.driverId);
    } else if (body.currentDriverPosition) {
      return this.updateDriverPosition(travelId, body.currentDriverPosition);
    }

    return TravelRepository.patchTravel(travelId, body);
  }

  checkDriverConfirmation(travelId) {
    return TravelRepository.checkDriverConfirmation(travelId);
  }

}

module.exports = new TravelService();