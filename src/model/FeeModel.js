const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const changePriceSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  percentageToChange: {
    type: Number,
    required: true
  }
});

const paymentSchema = new Schema({
  paymentType: {
    type: String,
    required: true
  },
  percentageToChange: {
    type: Number,
    required: true
  }
});

const changePriceByDay = new Schema({
  day: {
    type: String,
    required: true
  },
  extraFee: {
    type: Number,
    required: true
  }
});

const changePriceByHour = new Schema({
  hour: {
    type: String,
    required: true
  },
  extraFee: {
    type: Number,
    required: true
  }
});

const FeesSchema = new Schema({
  price: {
    type: Number,
    required: true
  },
  applied: {
    type: Boolean,
    required: true
  },
  timeWindow: [{
    type: changePriceSchema,
    required: true
  }],
  seniority: [{
    type: changePriceSchema,
    required: true
  }],
  methodOfPayment: [
    { type: paymentSchema, required: true }
  ],
  travelDuration: [{
    type: changePriceSchema,
    required: true
  }],
  travelDistance: {
    type: Number,
    required: true
  },
  travelDate: [{ type: changePriceByDay, required: true }],
  travelHour: [{ type: changePriceByHour, required: true }]
});

const Fees = mongoose.model('fees', FeesSchema);

module.exports = Fees;

// dailyTravels: {
  //   type: changePriceSchema,
  //   required: true
  // },
  // monthlyTravels: {
  //   type: changePriceSchema,
  //   required: true
  // },