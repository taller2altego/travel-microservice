const TravelModel = require('../model/TravelModel');

class TravelRepository {
  constructor() { }

  findTravelsByUserId(userId) {
    return TravelModel.find().where('userId').equals(userId);
  }
}

module.exports = new TravelRepository();