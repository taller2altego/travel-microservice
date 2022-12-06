// Testing
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const sandbox = require('sinon');

// Models
const FeeModel = require('../../../src/model/FeeModel');

// Service under test
const FeeRepository = require('../../../src/repository/FeeRepository');
const expectedFee = {
  _doc: {
    _id: '63892f091937f4604936e8a1',
    applied: true,
    price: 0.001,
    travelDistance: 2
  },
  timeWindow: [
    {
      _doc: {
        quantity: 5,
        percentageToChange: 0.01,
        _id: '63892f091937f4604936e8a2'
      }
    }
  ],
  seniority: [
    {
      _doc: {
        quantity: 5,
        percentageToChange: 0.01,
        _id: '63892f091937f4604936e8a3'
      }
    }
  ],
  methodOfPayment: [
    {
      _doc: {
        paymentType: 'Ether',
        percentageToChange: 0.01,
        _id: '63892f091937f4604936e8a4'
      }
    }
  ],
  travelDuration: [
    {
      _doc: {
        quantity: 5,
        percentageToChange: 0.01,
        _id: '63892f091937f4604936e8a5'
      }
    }
  ],
  travelDate: [
    {
      _doc: {
        day: 'martes',
        extraFee: 0.01,
        _id: '63892f091937f4604936e8a6'
      }
    }
  ],
  travelHour: [
    {
      _doc: {
        hour: '10',
        extraFee: 0.01,
        _id: '63892f091937f4604936e8a7'
      }
    }
  ],
  __v: 0
};

const resultFee = {
  id: '63892f091937f4604936e8a1',
  price: 0.001,
  travelDistance: 2,
  applied: true,
  timeWindow: [{ quantity: 5, percentageToChange: 0.01 }],
  seniority: [{ quantity: 5, percentageToChange: 0.01 }],
  methodOfPayment: [{ paymentType: 'Ether', percentageToChange: 0.01 }],
  travelDuration: [{ quantity: 5, percentageToChange: 0.01 }],
  travelDate: [{ day: 'martes', extraFee: 0.01 }],
  travelHour: [{ hour: '10', extraFee: 0.01 }]
};

describe.only('FeeRepository Test Suite', () => {
  afterEach(sandbox.restore);

  describe('findFeeById', () => {
    let mockFee;

    beforeEach(() => {
      mockFee = sandbox.mock(FeeModel);
    });

    afterEach(() => sandbox.restore());

    it('Should findFeeById as expected', async () => {

      const equalsObj = { equals: () => { } };
      const mockequals = sandbox.mock(equalsObj);

      const whereObj = { where: () => { } };
      const mockwhere = sandbox.mock(whereObj);

      mockequals.expects('equals').withArgs(1).resolves(expectedFee);
      mockwhere.expects('where').withArgs('_id').returns(equalsObj);
      mockFee.expects('findOne').once().withArgs().returns(whereObj);

      const result = await FeeRepository.findFeeById(1);

      expect(result).to.deep.equal(resultFee);
      sandbox.verify();
    });
  });

  describe('findFee', () => {
    let mockFee;

    beforeEach(() => {
      mockFee = sandbox.mock(FeeModel);
    });

    afterEach(() => sandbox.restore());

    it('Should find fees as expected', async () => {

      const skipObj = { skip: () => { } };
      const mockskip = sandbox.mock(skipObj);

      const limitObj = { limit: () => { } };
      const mocklimit = sandbox.mock(limitObj);

      mockskip.expects('skip').withArgs(30).resolves([expectedFee]);
      mocklimit.expects('limit').withArgs(10).returns(skipObj);
      mockFee.expects('find').once().withArgs().returns(limitObj);
      mockFee.expects('count').once().withArgs().resolves(100);

      const result = await FeeRepository.findFees(4, 10);

      expect(result).to.deep.equal({ data: [resultFee], limit: 10, page: 4, total: 100 });
      sandbox.verify();
    });
  });

  describe('findAppliedFee', () => {
    let mockFee;

    beforeEach(() => {
      mockFee = sandbox.mock(FeeModel);
    });

    afterEach(() => sandbox.restore());

    it('Should findAppliedFee as expected', async () => {

      const equalsObj = { equals: () => { } };
      const mockequals = sandbox.mock(equalsObj);

      const whereObj = { where: () => { } };
      const mockwhere = sandbox.mock(whereObj);

      mockequals.expects('equals').withArgs(true).resolves(expectedFee);
      mockwhere.expects('where').withArgs('applied').returns(equalsObj);
      mockFee.expects('findOne').once().withArgs().returns(whereObj);

      const result = await FeeRepository.findAppliedFee();

      expect(result).to.deep.equal(resultFee);
      sandbox.verify();
    });
  });

  describe('createFee', () => {
    let mockFee;

    beforeEach(() => {
      mockFee = sandbox.mock(FeeModel.prototype);
    });

    afterEach(() => sandbox.restore());

    it('Should createFee as expected', async () => {
      mockFee
        .expects('save')
        .once()
        .withArgs()
        .resolves(expectedFee);

      const result = await FeeRepository.createFee({ random: true });

      expect(result).to.deep.equal(resultFee);
      sandbox.verify();
    });
  });

  describe('patchFee', () => {
    let mockFee;

    beforeEach(() => {
      mockFee = sandbox.mock(FeeModel);
    });

    afterEach(() => sandbox.restore());

    it('Should apply fee as expected', async () => {
      mockFee.expects('updateOne').once().withArgs({ applied: true }, { applied: false }).resolves({});
      mockFee.expects('updateOne').once().withArgs({ _id: 1 }, { applied: true }).resolves({});

      const result = await FeeRepository.patchFee(1, { applied: true });
      expect(result).to.deep.equal({});
      sandbox.verify();
    });
  });
});