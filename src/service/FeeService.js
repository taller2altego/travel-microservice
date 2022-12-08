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
  incrementByDay(date, travelDate) {
    const selectedDay = moment(date).utcOffset(0).days();
    const matchDay = travelDate.filter(({ day }) => day === selectedDay)[0];
    return matchDay !== undefined ? matchDay.extraFee : 0;
  }

  incrementByHour(date, travelHours) {
    const currentHour = moment(date).utcOffset(0).subtract(3, 'hours').hours();
    const matchHour = travelHours.filter(({ hour }) => hour === currentHour)[0];
    return matchHour !== undefined ? matchHour.extraFee : 0;
  }

  percentageByDistance(distance, distanceFee) {
    return distance * distanceFee;
  }

  percentageByDuration(distance, duration, durationFee) {
    if (distance * durationFee.quantity < duration) {
      return duration * durationFee.percentageToChange;
    }
    return 0;
  }

  percentageByPayment(paymentMethod, paymentsFee) {
    const selectedPayment = paymentsFee
      .filter(({ paymentType }) => paymentType === paymentMethod)[0];

    if (selectedPayment === undefined) {
      throw new InvalidPaymentMethod();
    }

    return selectedPayment.percentageToChange;
  }

  percentageBySeniority(seniority, seniorityFee) {
    const selectedSeniority = seniorityFee.filter(({ quantity }) => quantity < seniority)[0];
    return selectedSeniority ? selectedSeniority.percentageToChange : 0;
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
    const {
      distance,
      duration,
      paymentMethod,
      seniority
    } = query;

    const {
      travelDuration,
      travelDistance,
      methodOfPayment
    } = fees;

    const distancePercentage = this.percentageByDistance(Number(distance), travelDistance);
    const durationPercentage = this.percentageByDuration(
      Number(distance),
      Number(duration),
      travelDuration
    );
    const paymentMethodPercentage = this.percentageByPayment(paymentMethod, methodOfPayment);
    const seniorityPercentage = this.percentageBySeniority(Number(seniority), fees.seniority);

    const totalPercentage = [
      distancePercentage,
      durationPercentage,
      paymentMethodPercentage,
      seniorityPercentage
    ].reduce((acum, current) => acum + current);

    const totalModifiedPriceByPercentage = price * totalPercentage;
    const incrementByDay = this.incrementByDay(date, fees.travelDate);
    const incrementByHour = this.incrementByHour(date, fees.travelHour);
    return { price: totalModifiedPriceByPercentage + incrementByDay + incrementByHour };
  }
}

module.exports = new FeeService();
