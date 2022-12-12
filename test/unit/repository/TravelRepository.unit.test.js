/* eslint-disable no-undef */
// Testing
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const sandbox = require('sinon');

// Models
const TravelModel = require('../../../src/model/TravelModel');

// Service under test
const TravelRepository = require('../../../src/repository/TravelRepository');
const { SEARCHING_DRIVER, FINISHED } = require('../../../src/utils/statesTravel');

describe('TravelRepository Test Suite', () => {
  afterEach(sandbox.restore);

  describe('findTravels', () => {
    let mockTicket;

    beforeEach(() => {
      mockTicket = sandbox.mock(TravelModel);
    });

    afterEach(() => sandbox.restore());

    it('Should find travels as expected', async () => {
      const equalsObj = { equals: () => { } };
      const mockEquals = sandbox.mock(equalsObj);

      const whereObj = { where: () => { } };
      const mockWhere = sandbox.mock(whereObj);

      mockEquals
        .expects('equals')
        .withArgs(SEARCHING_DRIVER)
        .resolves({ _id: 1 });

      mockWhere
        .expects('where')
        .withArgs('status')
        .returns(equalsObj);

      mockTicket
        .expects('findOne')
        .once()
        .withArgs({ source: { $near: { $geometry: { type: 'Point', coordinates: 1 } } } })
        .returns(whereObj);

      const result = await TravelRepository.findTravels(1);

      expect(result).to.deep.equal({ _id: 1 });
      sandbox.verify();
    });
  });

  describe('findTravel', () => {
    let mockTicket;

    beforeEach(() => {
      mockTicket = sandbox.mock(TravelModel);
    });

    afterEach(() => sandbox.restore());

    it('Should find travel as expected', async () => {

      const equalsObj = { equals: () => { } };
      const mockEquals = sandbox.mock(equalsObj);

      const whereObj = { where: () => { } };
      const mockWhere = sandbox.mock(whereObj);

      mockEquals
        .expects('equals')
        .withArgs(1)
        .resolves({ _id: 1 });

      mockWhere
        .expects('where')
        .withArgs('_id')
        .returns(equalsObj);

      mockTicket
        .expects('findOne')
        .once()
        .withArgs()
        .returns(whereObj);

      const result = await TravelRepository.findTravel(1);

      expect(result).to.deep.equal({ _id: 1 });
      sandbox.verify();
    });
  });

  describe('findTravelsByUserId', () => {
    let mockTicket;

    beforeEach(() => {
      mockTicket = sandbox.mock(TravelModel);
    });

    afterEach(() => sandbox.restore());

    it('Should find travel as expected', async () => {

      // find tests
      const firstEqualsObj = { equals: () => { } };
      const secondEqualsObj = { equals: () => { } };
      const mockFirstEquals = sandbox.mock(firstEqualsObj);
      const mockSecondEquals = sandbox.mock(secondEqualsObj);
      const firstWhereObj = { where: () => { } };
      const secondWhereObj = { where: () => { } };
      const mockFirstWhere = sandbox.mock(firstWhereObj);
      const mockSecondWhere = sandbox.mock(secondWhereObj);
      const skipObj = { skip: () => { } };
      const mockSkip = sandbox.mock(skipObj);
      const limitObj = { limit: () => { } };
      const mockLimit = sandbox.mock(limitObj);

      mockSecondEquals.expects('equals').withArgs(FINISHED).resolves([{ _id: 1 }]);
      mockSecondWhere.expects('where').withArgs('status').returns(secondEqualsObj);
      mockFirstEquals.expects('equals').withArgs(1).returns(secondWhereObj);
      mockFirstWhere.expects('where').withArgs('userId').returns(firstEqualsObj);
      mockSkip.expects('skip').withArgs(0).returns(firstWhereObj);
      mockLimit.expects('limit').withArgs(1).returns(skipObj);
      mockTicket.expects('find').once().withArgs().returns(limitObj);

      // count tests
      const equalsObj = { equals: () => { } };
      const mockEquals = sandbox.mock(equalsObj);
      const whereObj = { where: () => { } };
      const mockWhere = sandbox.mock(whereObj);

      mockEquals.expects('equals').withArgs(1).resolves(1);
      mockWhere.expects('where').withArgs('userId').returns(equalsObj);
      mockTicket.expects('count').once().withArgs().returns(whereObj);

      const result = await TravelRepository.findTravelsByUserId(1, { page: 1, limit: 1 });

      expect(result).to.deep.equal({ data: [{ _id: 1 }], page: 1, limit: 1, total: 1 });
      sandbox.verify();
    });
  });

  describe('patchTravel', () => {
    let mockTicket;

    beforeEach(() => {
      mockTicket = sandbox.mock(TravelModel);
    });

    afterEach(() => sandbox.restore());

    it('Should call ticket models as expected', async () => {
      mockTicket
        .expects('updateOne')
        .once()
        .withArgs({ _id: 1 }, { random: true })
        .resolves({});

      const result = await TravelRepository.patchTravel(1, { random: true });

      expect(result).to.deep.equal({});
      sandbox.verify();
    });
  });

  describe('createTravel', () => {
    let mockTicket;

    beforeEach(() => {
      mockTicket = sandbox.mock(TravelModel.prototype);
    });

    afterEach(() => sandbox.restore());

    it('Should call travel models as expected', async () => {
      mockTicket
        .expects('save')
        .once()
        .withArgs()
        .resolves({});

      const result = await TravelRepository.createTravel({ random: true });

      expect(result).to.deep.equal({});
      sandbox.verify();
    });
  });

  describe('checkDriverConfirmation', () => {
    let mockTicket;

    beforeEach(() => {
      mockTicket = sandbox.mock(TravelModel);
    });

    afterEach(() => sandbox.restore());

    it('Should call ticket models as expected', async () => {
      const equalsObj = { equals: () => { } };
      const mockEquals = sandbox.mock(equalsObj);

      const whereObj = { where: () => { } };
      const mockWhere = sandbox.mock(whereObj);

      mockEquals
        .expects('equals')
        .withArgs(1)
        .resolves([{ _id: 1, driverId: 5, currentDriverPosition: [1, 2], status: 'ok' }]);

      mockWhere
        .expects('where')
        .withArgs('_id')
        .returns(equalsObj);

      mockTicket
        .expects('find')
        .once()
        .withArgs()
        .returns(whereObj);

      const result = await TravelRepository.checkDriverConfirmation(1);

      expect(result).to.deep.equal({ driverId: 5, currentDriverPosition: [1, 2], status: 'ok' });
      sandbox.verify();
    });
  });
});