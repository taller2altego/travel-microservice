const TravelModel = require('../model/TravelModel');

class TravelRepository {
  constructor() { }

  async findTravelsByUserId(userId, query) {
    const { page, limit } = query;
    const travels = await TravelModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .where('userId')
      .equals(userId);

    const count = await TravelModel.count();

    return { data: [...travels], limit, page, total: count };
  }

  createTravel(body) {
    const newUserTravel = new TravelModel(body);
    return newUserTravel.save();
  }

  patchTravel(travelId, body) {
    return TravelModel.updateOne({ _id: travelId }, body);
  }

  checkDriverConfirmation(travelId) {
    return TravelModel
      .find()
      .where('_id')
      .equals(travelId)
      .then(response => {
        return { driverId: response[0].driverId, currentDriverPosition: response[0].currentDriverPosition };
      });
  }
}

module.exports = new TravelRepository();