/* eslint-disable no-undef */
// Testing
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const sandbox = require('sinon');

// Repositories
const FeeRepository = require('../../../src/repository/FeeRepository');

// services
const FeeService = require('../../../src/service/FeeService');

describe('FeeService Unit Tests', () => {
  describe('findFees', () => {
    let feeRepository;

    beforeEach(() => {
      feeRepository = sandbox.mock(FeeRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call find fees as expected', async () => {
      feeRepository
        .expects('findfees')
        .once()
        .withArgs(1, 2)
        .resolves({});

      const fees = await FeeService.findFees(1, 2);
      expect(fees).to.deep.equal({});
    });
  });

  describe('findFeeById', () => {
    let feeRepository;

    beforeEach(() => {
      feeRepository = sandbox.mock(FeeRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call get fee as expected', async () => {
      feeRepository
        .expects('findFeeById')
        .once()
        .withArgs(1)
        .resolves({ id: 1 });

      const fee = await FeeService.findFeeById(1);
      expect(fee).to.deep.equal({ id: 1 });
    });

    it('Should throw error when fee is undefined', async () => {
      feeRepository
        .expects('findFeeById')
        .once()
        .withArgs(1)
        .resolves(null);

      await FeeService
        .findFeeById(1)
        .then(() => { throw new Error(); })
        .catch(err => expect(err.message).to.equal('Fee not found'));
    });
  });

  describe('createFee', () => {
    let feeRepository;

    beforeEach(() => {
      feeRepository = sandbox.mock(FeeRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should create fee as expected', async () => {
      feeRepository
        .expects('createFee')
        .once()
        .withArgs({ prop: 1 })
        .resolves({ result: true });

      const travel = await FeeService.createFee({ prop: 1 });
      expect(travel).to.deep.equal({ result: true });
    });
  });

  describe('patchFee', () => {
    let feeRepository;

    beforeEach(() => {
      feeRepository = sandbox.mock(FeeRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should patch fee as expected', async () => {
      feeRepository
        .expects('patchFee')
        .once()
        .withArgs({ prop: 1 })
        .resolves({ result: true });

      const travel = await FeeService.createFee({ prop: 1 });
      expect(travel).to.deep.equal({ result: true });
    });
  });

  describe('priceByDay', () => {
    it('Should match a day and change the price', async () => {
      const date = '2022-12-05T01:01:59.708Z';
      const price = await FeeService.priceByDay(0.00001, date, [{ day: 1, extraFee: 0.002 }]);
      expect(price).to.deep.equal(0.00201);
    });

    it('Should not match a day and change the price', async () => {
      const date = '2022-12-05T01:01:59.708Z';
      const price = await FeeService.priceByDay(0.00001, date, [{ day: 2, extraFee: 0.002 }]);
      expect(price).to.deep.equal(0.00001);
    });
  });

  describe('priceByHour', () => {
    it('Should match an hour and change the price', async () => {
      const date = '2022-12-05T23:01:59.708Z';
      const price = await FeeService.priceByHour(0.00001, date, [{ hour: 23, extraFee: 0.002 }]);
      expect(price).to.deep.equal(0.00201);
    });

    it('Should match a hour and change the price', async () => {
      const date = '2022-12-05T01:01:59.708Z';
      const price = await FeeService.priceByHour(0.00001, date, [{ hour: 2, extraFee: 0.002 }]);
      expect(price).to.deep.equal(0.00001);
    });
  });

  describe('priceByDistance', () => {
    it('Should change the price', async () => {
      const price = await FeeService.priceByDistance(0.00001, 30, 0.00001);
      expect(price).to.deep.equal(0.00031000000000000005);
    });
  });

  describe('priceByDuration', () => {
    it('Should match duration and change the price', async () => {
      const price = await FeeService.priceByDuration(0.00001, 30, 20, { quantity: 10, percentageToChange: 0.002 });
      expect(price).to.deep.equal(0.00001002);
    });

    it('Should match a hour and change the price', async () => {
      const price = await FeeService.priceByDuration(0.00001, 10, 180, { quantity: 10, percentageToChange: 0.002 });
      expect(price).to.deep.equal(0.00001);
    });
  });

  describe('priceByPayment', () => {
    it('Should match payment and change the price', async () => {
      const price = await FeeService.priceByPayment(0.00001, 'ETH', [{ paymentType: 'ETH', percentageToChange: 0.002 }]);
      expect(price).to.deep.equal(0.00001002);
    });

    it('Should not match payment and change the price', async () => {
      await FeeService.priceByPayment(0.00001, 'ETH', [{ paymentType: 'BTC', percentageToChange: 0.002 }])
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.equal('Invalid payment method');
        });
    });
  });

  describe('priceBySeniority', () => {
    it('Should match seniority and change the price', async () => {
      const price = await FeeService.priceBySeniority(0.00001, 10, [{ quantity: 5, percentageToChange: 0.002 }]);
      expect(price).to.deep.equal(0.00001002);
    });

    it('Should not match seniority and change the price', async () => {
      const price = await FeeService.priceBySeniority(0.00001, 10, [{ quantity: 15, percentageToChange: 0.002 }]);
      expect(price).to.equal(0.00001);
    });
  });

  describe('price', () => {
    let feeRepository;

    beforeEach(() => {
      feeRepository = sandbox.mock(FeeRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should fail when the feeId is not found', async () => {
      feeRepository
        .expects('findFeeById')
        .once()
        .withArgs(1)
        .resolves(null);

      await FeeService
        .getPrice({ feeId: 1 })
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.equal('Fee not found');
        });
    });

    it('Should fail when there is any applied fee', async () => {
      feeRepository
        .expects('findAppliedFee')
        .once()
        .withArgs()
        .resolves(null);

      await FeeService
        .getPrice()
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.equal('No hay fee aplicado');
        });
    });

    it('Should return the correct price', async () => {
      feeRepository
        .expects('findAppliedFee')
        .once()
        .withArgs()
        .resolves({
          id: '123',
          price: 0.00001,
          applied: true,
          travelDate: {},
          travelHour: {},
          travelDistance: {},
          travelDuration: {},
          methodOfPayment: {},
          seniority: {}
        });

      const price = await FeeService.getPrice();
      expect(price).to.equal(0);
    });
  });
});
