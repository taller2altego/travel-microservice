const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelSchema = new Schema({
  price: {
    type: Number,
    required: true
  }
});

const TravelsSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  driverId: {
    type: Number,
    required: false,
  },
  travel: TravelSchema
});

const Travels = mongoose.model('travels', TravelsSchema);

module.exports = Travels;