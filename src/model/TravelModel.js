const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  driverId: {
    type: Number,
    required: false,
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
  destination: {
    type: pointSchema,
    required: true
  },
  currentDriverPosition: {
    type: pointSchema,
    required: false
  },
  date: {
    type: Date,
    required: true
  }
});

TravelsSchema.index({ source: '2dsphere' });

const Travels = mongoose.model('travels', TravelsSchema);

module.exports = Travels;