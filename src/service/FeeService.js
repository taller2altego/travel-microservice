const FeeRepository = require('../repository/FeeRepository');
const { FeeNotFound } = require('../utils/errors');

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
}

module.exports = new FeeService();