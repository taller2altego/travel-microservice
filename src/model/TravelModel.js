const mongoose = require('mongoose');

const { Schema } = mongoose;
const { SERCHING_DRIVER } = require('../utils/statesTravel');

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const TravelsSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  userScore: {
    type: Number,
    required: false,
    default: 0
  },
  driverId: {
    type: Number,
    required: false
  },
  driverScore: {
    type: Number,
    required: false,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  source: {
    type: pointSchema,
    index: '2dsphere',
    required: true
  },
  sourceAddress: {
    type: String,
    required: true
  },
  destination: {
    type: pointSchema,
    required: true
  },
  destinationAddress: {
    type: String,
    required: true
  },
  currentDriverPosition: {
    type: pointSchema,
    required: false
  },
  status: {
    type: String,
    required: true,
    default: SERCHING_DRIVER
  },
  date: {
    type: Date,
    required: true
  },
  paidWithCredits: {
    type: Boolean,
    required: true
  }
});

TravelsSchema.index({ source: '2dsphere' });

const Travels = mongoose.model('travels', TravelsSchema);

module.exports = Travels;
