const FeeRepository = require('../repository/FeeRepository');
const { FeeNotFound, InvalidPaymentMethod } = require('../utils/errors');

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

  priceByDay(price, date, travelDate) {
    const dayOfWeekName = date.toLocaleString('default', { weekday: 'long' });
    const matchDay = travelDate.filter(({ day }) => day === dayOfWeekName)[0];
    if (matchDay !== undefined) {
      return price + matchDay.extraFee;
    } else {
      return price;
    }
  }

  priceByHour(price, date, travelHours) {
    const currentHour = date.getHours();
    const matchHour = travelHours.filter(({ hour }) => hour === currentHour)[0];
    if (matchHour !== undefined) {
      return price + matchHour.extraFee;
    } else {
      return price;
    }
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
    const selectedPayment = paymentsFee.filter(({ paymentType }) => paymentType === paymentMethod)[0];
    if (selectedPayment === undefined) {
      throw new InvalidPaymentMethod();
    }
    return price + price * selectedPayment.percentageToChange;
  }

  priceBySeniority(price, seniority, seniorityFee) {
    const selectedPayment = seniorityFee.filter(({ quantity }) => quantity < seniority)[0];
    return selectedPayment ? price + price * selectedPayment.percentageToChange : price;
  }

  async getPrice(query) {
    const { id, price, applied, ...fees } = await (query.feeId ? FeeRepository.findFeeById(query.feeId) : FeeRepository.findAppliedFee());
    const date = new Date(query.date);
    const priceByDay = this.priceByDay(price, date, fees.travelDate);
    console.log(priceByDay);
    const priceByHour = this.priceByHour(priceByDay, date, fees.travelHour);
    console.log(priceByHour);
    const distancePrice = this.priceByDistance(priceByHour, query.distance, fees.travelDistance);
    console.log(distancePrice);
    const durationPrice = this.priceByDuration(distancePrice, query.distance, query.duration, fees.travelDuration);
    console.log(durationPrice);
    const paymentMethodPrice = this.priceByPayment(durationPrice, query.paymentMethod, fees.methodOfPayment);
    console.log(paymentMethodPrice);
    const seniorityPrice = this.priceBySeniority(paymentMethodPrice, Number.parseInt(query.seniority), fees.seniority);
    console.log(seniorityPrice);
    return { price: seniorityPrice };
  }
}

module.exports = new FeeService();