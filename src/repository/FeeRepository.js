const FeeModel = require('../model/FeeModel');

class FeeRepository {
  constructor() {
    this.keysToParse = [
      'dailyTravels',
      'monthlyTravels',
      'seniority',
      'methodOfPayment',
      'travelDuration',
      'travelDistance',
      'travelDate',
      'travelHour'
    ];
  }

  parseData(data) {
    console.log(data);
    const id = data._doc._id || undefined;
    price = data._doc.price || undefined;
    applied = data._doc.applied || undefined;
    return this.keysToParse.reduce((parsedObject, keyToBeParsed) => {
      if (data[keyToBeParsed] === undefined) {
        return parsedObject;
      }
      if (Array.isArray(data[keyToBeParsed])) {
        const parsedValues = data[keyToBeParsed].map(({ _doc: { _id, ...parsedValue } }) => ({ ...parsedValue }));
        return { ...parsedObject, [keyToBeParsed]: parsedValues };
      } else {
        const { _id, ...parsedValue } = data[keyToBeParsed]._doc;
        return { ...parsedObject, [keyToBeParsed]: parsedValue };
      }
    }, { id, price, applied });
  }

  async findFees(page, limit) {
    const travels = await FeeModel
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .then(rows => rows.map(row => this.parseData(row)));

    const count = await FeeModel.count();

    return { data: [...travels], limit, page, total: count };
  }

  findFeeById(id) {
    return FeeModel
      .findOne()
      .where('_id')
      .equals(id)
      .then(row => this.parseData(row));
  }

  createFee(body) {
    const newFee = new FeeModel({ ...body, applied: false });
    return newFee
      .save()
      .then(row => this.parseData(row));
  }

  async patchFee(feeId, body) {
    if (body.applied) {
      await FeeModel.updateOne({ applied: true }, { applied: false });
    }

    return FeeModel.updateOne({ _id: feeId }, body);
  }
}

module.exports = new FeeRepository();