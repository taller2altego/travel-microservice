const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelsSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  driverId: {
    type: Number,
    required: false,
  },
  price: {
    type: Number,
    required: true
  },
  source: {
    type: JSON,
    required: true
  },
  destination: {
    type: JSON,
    required: true
  },
  currentDriverPosition: {
    type: JSON,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Travels = mongoose.model('travels', TravelsSchema);

module.exports = Travels;