const TravelModel = require('../model/TravelModel');

class TravelRepository {
  constructor() { }

  signUp(body) {
    return TravelModel
      .create(body)
      .then(Travel => Travel.toJSON());
  }

  findAll({ email }) {
    const where = {};
    if (email) {
      where['email'] = email;
    }

    return TravelModel
      .findAll({ where })
      .then(Travels => Travels.map(Travel => Travel.toJSON()));
  }

  findById(id) {
    return TravelModel
      .findByPk(id)
      .then(Travel => Travel.toJSON());
  }

  findTravelByEmail(email) {
    return TravelModel
      .findOne({ where: { email } })
      .then(Travel => {
        if (Travel === null) {
          return Travel;
        }
        return Travel.toJSON();
      });
  }

  patchById(id, body) {
    return TravelModel.update(body, { where: { id } });
  }

  patchByEmail(email, body) {
    return TravelModel.update(body, { where: { email } });
  }

  removeById(id) {
    return TravelModel.destroy({ where: { id } });
  }
}

module.exports = new TravelRepository();