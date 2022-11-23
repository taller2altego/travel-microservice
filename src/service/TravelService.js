const TravelRepository = require('../repository/TravelRepository');
const { CurrentPositionIsRequired } = require('../utils/errors');
const { SERCHING_DRIVER, WAITING_DRIVER, STARTED, FINISHED, CANCELLED } = require('../utils/statesTravel');
const { InvalidTypeTravelForMethod } = require('../utils/errors');
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

  setStateTravelByTravelId(travelId, status) {
    console.log(travelId);
    console.log(status);
    return TravelRepository.patchTravel(travelId, status);
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

  async acceptTravel(travelId, body) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status != SERCHING_DRIVER){
      throw new InvalidTypeTravelForMethod('Para aceptar un viaje, este debe estar en estado SEARCHING DRIVER');
    }
    const status = WAITING_DRIVER;
    return await this.setStateTravelByTravelId(travelId, { status });
  }

  async rejectTravel(travelId, body, isRejectedByTravel) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status != SERCHING_DRIVER && !isRejectedByTravel){
      if (travel.status != WAITING_DRIVER){
        throw new InvalidTypeTravelForMethod('Para iniciar un viaje, este debe estar en estado SEARCHING DRIVER o WAITING');
      }
      throw new InvalidTypeTravelForMethod('Se debe cancelar el viaje mediante isRejectedByTravel variable');
    }
    
    const status = isRejectedByTravel === true ? CANCELLED : WAITING_DRIVER;
    return this.setStateTravelByTravelId(travelId, { status, driverId: null, currentDriverPosition: null });
  }

  async startTravel(travelId, body) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status != WAITING_DRIVER){
      console.log(travel);
      throw new InvalidTypeTravelForMethod('Para iniciar un viaje, este debe estar en estado WAITING DRIVER');
    }
    const status = STARTED;
    return this.setStateTravelByTravelId(travelId, { status });
  }
  async finishTravel(travelId, body) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status != STARTED){
      throw new InvalidTypeTravelForMethod('Para iniciar un viaje, este debe estar en estado STARTED');
    }
    const status = FINISHED;
    return this.setStateTravelByTravelId(travelId, { status });
  }

  checkDriverConfirmation(travelId) {
    return TravelRepository
      .checkDriverConfirmation(travelId)
      .then(response => this.parseCurrentPosition(response));
  }
}

module.exports = new TravelService();
