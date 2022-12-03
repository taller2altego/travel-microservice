const TravelModel = require('../model/TravelModel');

class TravelRepository {
  findTravels(position) {
    const source = { $near: { $geometry: { type: 'Point', coordinates: position } } };
    return TravelModel.findOne({ source });
  }

  findTravel(travelId) {
    return TravelModel
      .findOne()
      .where('_id')
      .equals(travelId);
  }

  async findTravelsByUserId(userId, query) {
    const { page, limit } = query;
    const travels = await TravelModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .where('userId')
      .equals(userId);

    const count = await TravelModel
      .count()
      .where('userId')
      .equals(userId);

    return {
      data: [...travels], limit, page, total: count
    };
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
      .then(response => ({
        driverId: response[0].driverId,
        currentDriverPosition: response[0].currentDriverPosition
      }));
  }
}

module.exports = new TravelRepository();
