const TravelRepository = require('../repository/TravelRepository');

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
      driver: data.driverId,
      currentDriverPosition: {
        latitude: data.currentDriverPosition.coordinates[0],
        longitude: data.currentDriverPosition.coordinates[1]
      }
    };
  }

  findTravels(position) {
    return TravelRepository
      .findTravels(position)
      .then(travel => this.parseResponse(travel._doc));
  }

  findTravel(travelId) {
    return TravelRepository
      .findTravel(travelId)
      .then(travel => this.parseResponse(travel._doc));
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

  setDriverByTravelId(travelId, driverId) {
    return TravelRepository.patchTravel(travelId, { driverId });
  }

  updateDriverPosition(travelId, currentDriverPosition) {
    const body = this.parseInputCoordinates(currentDriverPosition);
    return TravelRepository.patchTravel(travelId, { currentDriverPosition: body });
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
    return TravelRepository
      .checkDriverConfirmation(travelId)
      .then(response => this.parseCurrentPosition(response));
  }
}

module.exports = new TravelService();