const moment = require('moment');
const logger = require('../../winston');

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
    const currentHour = moment(date).utcOffset(0).hours();
    logger.info(currentHour);
    const matchHour = travelHours.filter(({ hour }) => hour === currentHour)[0];
    logger.info(JSON.stringify(matchHour, undefined, 2));
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

    logger.info(`reglas: ${JSON.stringify(fees, undefined, 2)}`);
    logger.info(`query: ${JSON.stringify(query, undefined, 2)}`);

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
    logger.info(`Porcentaje por distancia: ${distancePercentage}`);

    const durationPercentage = this.percentageByDuration(
      Number(distance),
      Number(duration),
      travelDuration
    );
    logger.info(`Porcentaje por duration: ${durationPercentage}`);

    const paymentMethodPercentage = this.percentageByPayment(paymentMethod, methodOfPayment);
    logger.info(`Porcentaje por payments: ${paymentMethodPercentage}`);

    const seniorityPercentage = this.percentageBySeniority(Number(seniority), fees.seniority);
    logger.info(`Porcentaje por seniority: ${seniorityPercentage}`);

    const totalPercentage = [
      distancePercentage,
      durationPercentage,
      paymentMethodPercentage,
      seniorityPercentage
    ].reduce((acum, current) => acum + current);
    logger.info(`Porcentaje total: ${totalPercentage}`);

    const totalModifiedPriceByPercentage = price * totalPercentage;
    logger.info(`Precio total aplicado porcentaje: ${totalPercentage}`);

    const incrementByDay = this.incrementByDay(date, fees.travelDate);
    logger.info(`Incremento por dia: ${incrementByDay}`);

    const incrementByHour = this.incrementByHour(date, fees.travelHour);
    logger.info(`Incremento por dia: ${incrementByHour}`);

    return { price: totalModifiedPriceByPercentage + incrementByDay + incrementByHour };
  }
}

module.exports = new FeeService();
