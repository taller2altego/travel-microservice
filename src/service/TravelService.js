const TravelRepository = require('../repository/TravelRepository');
const { CurrentPositionIsRequired } = require('../utils/errors');

class TravelService {

  parseInputCoordinates(coord) {
    return {
      type: 'Point',
      coordinates: [coord.latitude, coord.longitude]
    };
  }

  parseInput(data) {
    return {
      ...data,
      source: this.parseInputCoordinates(data.source),
      destination: this.parseInputCoordinates(data.destination)
    };
  }

  parseResponse(data) {
    return {
      ...data,
      source: { latitude: data.source.coordinates[0], longitude: data.source.coordinates[1] },
      destination: { latitude: data.destination.coordinates[0], longitude: data.destination.coordinates[1] },
      currentDriverPosition: {
        latitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[0],
        longitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[1]
      }
    };
  }

  parseCurrentPosition(data) {
    return {
      driverId: data.driverId,
      currentDriverPosition: {
        latitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[0],
        longitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[1]
      }
    };
  }

  findTravels(position) {
    return TravelRepository
      .findTravels(position)
      .then(travel => travel ? this.parseResponse(travel._doc) : {});
  }

  findTravel(travelId) {
    return TravelRepository
      .findTravel(travelId)
      .then(travel => travel ? this.parseResponse(travel._doc) : {});
  }

  findTravelsByUserId(userId, query) {
    return TravelRepository
      .findTravelsByUserId(userId, query)
      .then(response => {
        if (response.data.length) {
          response.data = response.data.map(currentResponse => this.parseResponse(currentResponse._doc));
        }
        return response;
      });
  }

  createTravel(body) {
    const finalBody = this.parseInput(body);
    return TravelRepository
      .createTravel(finalBody)
      .then(res => this.parseResponse(res._doc));
  }

  setUserScoreByTravelId(travelId, userScore) {
    return TravelRepository.patchTravel(travelId, { userScore });
  }

  setDriverScoreByTravelId(travelId, driverScore) {
    return TravelRepository.patchTravel(travelId, { driverScore });
  }

  setDriverByTravelId(travelId, driverId, currentDriverPosition) {
    const position = this.parseInputCoordinates(currentDriverPosition);
    return TravelRepository.patchTravel(travelId, { driverId, currentDriverPosition: position });
  }

  updateDriverPosition(travelId, currentDriverPosition) {
    const body = this.parseInputCoordinates(currentDriverPosition);
    return TravelRepository.patchTravel(travelId, { currentDriverPosition: body });
  }

  async patchTravel(travelId, body) {
    if (body.driverId) {
      if (!body.currentDriverPosition) {
        throw new CurrentPositionIsRequired();
      }
      return this.setDriverByTravelId(travelId, body.driverId, body.currentDriverPosition);
    } else if (body.currentDriverPosition) {
      return this.updateDriverPosition(travelId, body.currentDriverPosition);
    } else if (body.userScore) {
      return this.setUserScoreByTravelId(travelId, body.userScore);
    } else if (body.driverScore) {
      return this.setDriverScoreByTravelId(travelId, body.driverScore);
    }

    return TravelRepository.patchTravel(travelId, body);
  }

  checkDriverConfirmation(travelId) {
    return TravelRepository
      .checkDriverConfirmation(travelId)
      .then(response => this.parseCurrentPosition(response));
  }
}

module.exports = new TravelService();