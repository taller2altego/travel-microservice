const TravelRepository = require('../repository/TravelRepository');
const { CurrentPositionIsRequired } = require('../utils/errors');
const { SERCHING_DRIVER, WAITING_DRIVER, STARTED, FINISHED } = require('../utils/statesTravel');
class TravelService {

  parseInputCoordinates(coord) {
    return {
      type: 'Point',
      coordinates: [coord.longitude, coord.latitude]
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
      source: { latitude: data.source.coordinates[1], longitude: data.source.coordinates[0] },
      destination: { latitude: data.destination.coordinates[1], longitude: data.destination.coordinates[0] },
      currentDriverPosition: {
        latitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[1],
        longitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[0]
      }
    };
  }

  parseCurrentPosition(data) {
    console.log(data);
    return {
      driverId: data.driverId,
      currentDriverPosition: {
        latitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[1],
        longitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[0]
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
    const finalBody = this.parseInput({ ...body, status: SERCHING_DRIVER });
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

  setStateTravelByTravelId(travelId, state) {
    return TravelRepository.patchTravel(travelId, { state });
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
      this.setStateTravelByTravelId(travelId, body);
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

  acceptTravel(travelId, body) {
    const status = WAITING_DRIVER;
    return TravelRepository.patchTravel(travelId, { status });
  }

  rejectTravel(travelId, body, isRejectedByTravel) {
    const status = isRejectedByTravel === true ? FINISHED : WAITING_DRIVER;
    return TravelRepository.patchTravel(travelId, { status, driverId: null, currentDriverPosition: null });
  }

  startTravel(travelId, body) {
    const status = STARTED;
    return TravelRepository.patchTravel(travelId, { status });
  }
  finishTravel(travelId, body) {
    const status = FINISHED;
    return TravelRepository.patchTravel(travelId, { status });
  }

  checkDriverConfirmation(travelId) {
    return TravelRepository
      .checkDriverConfirmation(travelId)
      .then(response => this.parseCurrentPosition(response));
  }
}

module.exports = new TravelService();
