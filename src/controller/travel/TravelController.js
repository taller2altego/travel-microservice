const logger = require('../../../winston');
const TravelService = require('../../service/TravelService');
const handlerResponse = require('../../utils/handlerResponse');



class TravelController {

  findTravels(req, res, next) {
    const { latitude, longitude, token } = req.query;
    console.log(`token ${token}`);
    return TravelService.findTravels([longitude, latitude], token)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  findTravel(req, res, next) {
    return TravelService.findTravel(req.params.travelId)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  findTravelsByUserId(req, res, next) {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query;

    return TravelService.findTravelsByUserId(userId, { page: Number.parseInt(page), limit: Number.parseInt(limit) })
      .then(travel => {
        res.customResponse = { statusCode: 200, ...travel };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  createTravel(req, res, next) {
    const body = req.body;
    return TravelService.createTravel(body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }


  acceptTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .acceptTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel accepted' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  rejectTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .rejectTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel rejected' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  startTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .startTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel started' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  finishTravel(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .finishTravel(travelId, req.body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, message: 'Travel finished' };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        if (err.statusCode === undefined) {
          res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
        } else {
          res.customResponse = { statusCode: err.statusCode, message: err.message };
        }
        next();
      });
  };

  patchTravel(req, res, next) {
    const travelId = req.params.travelId;
    const body = req.body;
    return TravelService
      .patchTravel(travelId, body)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 201 };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  checkDriverConfirmation(req, res, next) {
    const travelId = req.params.travelId;
    return TravelService
      .checkDriverConfirmation(travelId)
      .then(travel => {
        const data = travel;
        res.customResponse = { statusCode: 200, data };
        next();
      })
      .catch(err => {
        logger.error(err.stack);
        res.customResponse = handlerResponse(err);
        next();
      });
  }

  // // Reglas:
  // // Las reglas se validarán en este orden y se considerará como válida la primera regla que matchee.
  // // Se crea un viaje a un usuario.
  // // Se asigna un chofer null y un estado buscando chofer. Cualquier otro estado será considerado inválido, lo mismo el chofer.
  // async (req, res) => {
  //   try {
  //     const currentTravel = req.body;
  //     const userId = currentTravel.userId;

  //     const newUserTravel = new Travels({ userId, travels: [currentTravel] });
  //     return newUserTravel
  //       .save()
  //       .then(_createdUserTravel => res.status(200).send('ok'));

  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send('roto');
  //   }
  // }

  // async (req, res) => {
  //   res.status(200).send({ status: ["looking", "waiting", "canceled", "finished"] })
  // }

  // async (req, res) => {
  //   res.status(200).send({ price: 1000 });
  // }

  // // Reglas:
  // // Las reglas se validarán en este orden y se considerará como válida la primera regla que matchee.
  // // Si llega un query param driverId y el estado del viaje es buscando conductor o suspendido se confirmará el viaje con el conductor asignado. En otro caso se arrojará un bad request diciendo que no puede cambiarse el conductor.
  // // State puede tomar los valores "looking", "waiting", "canceled", "finished".
  // // La confirmación del viaje se dará con el state correspondiente en el body. Y initial_duration deberá iniciar con la fecha actual.
  // // Si un viaje pasa a estados waiting o finished el driverId y initial_duration deben ser null devuelta.
  // // Cuando el estado sea finished se podrá actualizar el valor de duration como la resta entre la fecha actual y initial_duration
  // // Source, destination, duration, price, 
  // router.put('/travels/:travelId', async (req, res) => {
  //   const travelId = req.params.travelId;

  //   const body = validateDriverRules(req.body);

  //   return Travels.updateOne({ travelId }, body);
  // });

  // // findTravelById(req, res, next) {
  // //   res.status(200).send({ message: '' });
  // // }




  // findAlltravels(req, res, next) {
  //   res.status(200).send({ message: '' });
  // }

  // findAllDrivers(req, res, next) {
  //   res.status(200).send({ message: '' });
  // }

  // associateDriverTotravel(req, res, next) {
  //   res.status(200).send({ message: '' });
  // }

  // patchDriverById(req, res, next) {
  //   res.status(200).send({ message: '' });
  // }

  // signUp(req, res, next) {
  //   return TravelService.signUp(req.body, req.params.id)
  //     .then(Travel => {
  //       const { password, ...response } = Travel;
  //       res.customResponse = { statusCode: 201, ...response };
  //       next();
  //     })
  //     .catch((err) => {
  //       if (err.statusCode === undefined) {
  //         res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
  //       } else {
  //         res.customRfindAlltravelsesponse = { statusCode: err.statusCode, message: err.message };
  //       }
  //       next();
  //     });
  // }

  // async login(req, res, next) {
  //   console.log(req.query);
  //   return TravelService.login(req.query)
  //     .then(Travels => {
  //       const data = Travels.map(({ password, ...r }) => r);
  //       res.customResponse = { statusCode: 200, data };
  //       next();
  //     })
  //     .catch(err => {
  //       console.log()
  //       res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       next();
  //     });
  // }

  // async findAllTravels(req, res, next) {
  //   return TravelService.findAllTravels(req.query)
  //     .then(Travels => {
  //       const data = Travels.map(({ password, ...r }) => r);
  //       res.customResponse = { statusCode: 200, data };
  //       next();
  //     })
  //     .catch(err => {
  //       res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       next();
  //     });
  // }

  // async findTravelById(req, res, next) {
  //   console.log(req);
  //   return TravelService.findTravelById(req.params.id)
  //     .then(Travel => {
  //       const { password, ...response } = Travel;
  //       res.customResponse = { statusCode: 200, ...response };
  //       next();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       if (err.statusCode === undefined) {
  //         res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
  //       } else {
  //         res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       }
  //       next();
  //     });
  // }

  // async verifyTravelByEmail(req, res, next) {
  //   console.log(req);
  //   return TravelService.verifyTravelByEmail(req.body.email)
  //     .then(() => {
  //       res.customResponse = { statusCode: 200 };
  //       next();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       if (err.statusCode === undefined) {
  //         res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
  //       } else {
  //         res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       }
  //       next();
  //     });
  // }



  // async patchTravelById(req, res, next) {
  //   return TravelService.patchTravelById(req.params.id, req.body)
  //     .then(() => {
  //       res.customResponse = { statusCode: 201 };
  //       next();
  //     })
  //     .catch((err) => {
  //       if (err.statusCode === undefined) {
  //         res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
  //       } else {
  //         res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       }
  //       next();
  //     });
  // }

  // async removeTravelById(req, res, next) {
  //   return TravelService.removeTravelById(req.params.id, req.body.email)
  //     .then(() => {
  //       res.customResponse = { statusCode: 204 };
  //       next();
  //     })
  //     .catch((err) => {
  //       if (err.statusCode === undefined) {
  //         res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
  //       } else {
  //         res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       }
  //       next();
  //     });
  // }

  // async changePasswordByEmail(req, res, next) {
  //   return TravelService.changePasswordByEmail(req.body.Travelname, req.body.newPassword)
  //     .then(() => {
  //       res.customResponse = { statusCode: 204 };
  //       next();
  //     })
  //     .catch((err) => {
  //       if (err.statusCode === undefined) {
  //         res.customResponse = { statusCode: 500, message: 'Unexpected Error' };
  //       } else {
  //         res.customResponse = { statusCode: err.statusCode, message: err.message };
  //       }
  //       next();
  //     });
  // }
}

module.exports = new TravelController();