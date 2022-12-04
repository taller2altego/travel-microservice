const axios = require('axios');
const logger = require('../../winston');

const TravelRepository = require('../repository/TravelRepository');
const { CurrentPositionIsRequired } = require('../utils/errors');
const {
  SERCHING_DRIVER, WAITING_DRIVER, STARTED, FINISHED, CANCELLED
} = require('../utils/statesTravel');

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
      source: {
        latitude: data.source.coordinates[1],
        longitude: data.source.coordinates[0]
      },
      destination: {
        latitude: data.destination.coordinates[1],
        longitude: data.destination.coordinates[0]
      },
      currentDriverPosition: {
        latitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[1],
        longitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[0]
      }
    };
  }

  parseCurrentPosition(data) {
    return {
      driverId: data.driverId,
      currentDriverPosition: {
        latitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[1],
        longitude: data.currentDriverPosition && data.currentDriverPosition.coordinates[0]
      }
    };
  }

  findTravels(position, token) {
    return TravelRepository
      .findTravels(position)
      .then(travel => this.parseResponse(travel._doc))
      .then(async parsedTravel => {
        console.log('procesando travel');
        const body = { to: token, title: 'Viaje encontrado!', body: 'Encontramos un viaje para vos' };
        const headers = { headers: { 'Content-Type': 'application/json' } };
        const url = 'https://exp.host/--/api/v2/push/send';

        await axios.post(url, body, headers)
          .then(response => {
            logger.info(JSON.stringify(response, undefined, 2));
          })
          .catch(err => {
            // logger.error(JSON.stringify(err, undefined, 2));
            console.log(err);
          });

        return parsedTravel;
      });
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
          response.data = response.data
            .map(currentResponse => this.parseResponse(currentResponse._doc));
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

  setStateTravelByTravelId(travelId, body, setting) {
    if (!body.currentDriverPosition && setting) {
      throw new CurrentPositionIsRequired();
    }
    return TravelRepository.patchTravel(travelId, body);
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
    } if (body.currentDriverPosition) {
      return this.updateDriverPosition(travelId, body.currentDriverPosition);
    } if (body.userScore) {
      return this.setUserScoreByTravelId(travelId, body.userScore);
    } if (body.driverScore) {
      return this.setDriverScoreByTravelId(travelId, body.driverScore);
    }

    return TravelRepository.patchTravel(travelId, body);
  }

  async acceptTravel(travelId, body) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status !== SERCHING_DRIVER) {
      throw new InvalidTypeTravelForMethod('Para aceptar un viaje, este debe estar en estado SEARCHING DRIVER');
    }

    const status = WAITING_DRIVER;
    const newStateTravel = {
      status,
      driverId: body.driverId,
      currentDriverPosition: body.currentDriverPosition
    };

    return this.setStateTravelByTravelId(travelId, newStateTravel, true)
      .then(() => TravelRepository.findTravel(travelId))
      .then(response => {
        const { token } = response;
        const tokenBody = {
          to: token,
          data: { extraData: 'Some data' },
          title: 'Viaje encontrado!',
          body: 'Encontramos un viaje para vos'
        };
        return axios.post('https://exp.host/--/api/v2/push/send', tokenBody);
      });
  }

  async rejectTravel(travelId) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status !== SERCHING_DRIVER && travel.status !== WAITING_DRIVER) {
      throw new InvalidTypeTravelForMethod('Para iniciar un viaje, este debe estar en estado SEARCHING DRIVER o WAITING DRIVER');
    }
    const status = CANCELLED;
    const body = { status, driverId: null, currentDriverPosition: null };
    return this.setStateTravelByTravelId(travelId, body, false);
  }

  async startTravel(travelId) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status !== WAITING_DRIVER) {
      throw new InvalidTypeTravelForMethod('Para iniciar un viaje, este debe estar en estado WAITING DRIVER');
    }
    const status = STARTED;
    return this.setStateTravelByTravelId(travelId, { status }, false);
  }

  async finishTravel(travelId) {
    const travel = await TravelRepository.findTravel(travelId);
    if (travel.status !== STARTED) {
      throw new InvalidTypeTravelForMethod('Para iniciar un viaje, este debe estar en estado STARTED');
    }
    const status = FINISHED;
    return this.setStateTravelByTravelId(travelId, { status }, false);
  }

  checkDriverConfirmation(travelId) {
    return TravelRepository
      .checkDriverConfirmation(travelId)
      .then(response => this.parseCurrentPosition(response));
  }

  test(token) {
    console.log(token);
    const tokenBody = {
      to: token,
      data: { extraData: 'Some data' },
      title: 'Prueba exitosa',
      body: 'Si no llega sos puto'
    };
    return axios.post('https://exp.host/--/api/v2/push/send', tokenBody);
  }
}

module.exports = new TravelService();
