const moment = require('moment');

const FeeRepository = require('../repository/FeeRepository');
const { FeeNotFound, InvalidPaymentMethod, FeeNotApplied } = require('../utils/errors');

class FeeService {
  async findFees(page, limit) {
    return FeeRepository.findFees(page, limit);
  }

  findFeeById(feeId) {
    return FeeRepository
      .findFeeById(feeId)
      .then(fee => {
        if (fee === null) {
          throw new FeeNotFound();
        } else {
          return fee;
        }
      });
  }

  createFee(body) {
    return FeeRepository.createFee(body);
  }

  patchFee(feeId, body) {
    return FeeRepository.patchFee(feeId, body);
  }

  /**
   *
   * @param {*} price
   * @param {*} date
   * @param {*} travelDate
   * @returns
   */
  priceByDay(price, date, travelDate) {
    const selectedDay = moment(date).utcOffset(0).days();
    const matchDay = travelDate.filter(({ day }) => day === selectedDay)[0];
    if (matchDay !== undefined) {
      return price + matchDay.extraFee;
    }
    return price;
  }

  priceByHour(price, date, travelHours) {
    const currentHour = moment(date).utcOffset(0).hours();
    const matchHour = travelHours.filter(({ hour }) => hour === currentHour)[0];

    if (matchHour !== undefined) {
      return price + matchHour.extraFee;
    }
    return price;
  }

  priceByDistance(price, distance, distanceFee) {
    return price + distance * distanceFee;
  }

  priceByDuration(price, distance, duration, durationFee) {
    if (distance * durationFee.quantity > duration) {
      return price + price * durationFee.percentageToChange;
    }

    return price;
  }

  priceByPayment(price, paymentMethod, paymentsFee) {
    const selectedPayment = paymentsFee
      .filter(({ paymentType }) => paymentType === paymentMethod)[0];

    if (selectedPayment === undefined) {
      throw new InvalidPaymentMethod();
    }

    return price + price * selectedPayment.percentageToChange;
  }

  priceBySeniority(price, seniority, seniorityFee) {
    const selectedSeniority = seniorityFee.filter(({ quantity }) => quantity < seniority)[0];
    return selectedSeniority ? price + price * selectedSeniority.percentageToChange : price;
  }

  async getPrice(query) {
    let fee;

    if (query.feeId) {
      fee = await FeeRepository.findFeeById(query.feeId);
      if (fee === null) {
        throw new FeeNotFound();
      }
    } else {
      fee = await FeeRepository.findAppliedFee();
      if (fee === null) {
        throw new FeeNotApplied();
      }
    }

    const {
      id, price, applied, ...fees
    } = fee;

    const { date } = query;
    const priceByDay = this.priceByDay(price, date, fees.travelDate);
    const priceByHour = this.priceByHour(priceByDay, date, fees.travelHour);
    const distancePrice = this.priceByDistance(priceByHour, query.distance, fees.travelDistance);

    const durationPrice = this.priceByDuration(
      distancePrice,
      query.distance,
      query.duration,
      fees.travelDuration
    );

    const paymentMethodPrice = this.priceByPayment(
      durationPrice,
      query.paymentMethod,
      fees.methodOfPayment
    );

    const seniorityPrice = this.priceBySeniority(
      paymentMethodPrice,
      Number(query.seniority),
      fees.seniority
    );

    return { price: seniorityPrice };
  }
}

module.exports = new FeeService();
