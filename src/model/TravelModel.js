const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelSchema = new Schema({
  price: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

//  date: "2022-08-01T03:01",

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