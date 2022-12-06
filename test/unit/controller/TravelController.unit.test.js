/* eslint-disable no-undef */
// Testing
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const sandbox = require('sinon');

// controller
const TravelController = require('../../../src/controller/travel/TravelController');

// Service
const TravelService = require('../../../src/service/TravelService');

describe('TravelController Test Suite', () => {
  afterEach(sandbox.restore);

  describe('findTravels', () => {
    let mockTravel;
    let mockNext;

    let objTest;

    beforeEach(() => {
      objTest = { send: (args) => { return args; } };
      mockTravel = sandbox.mock(TravelService);
      mockNext = sandbox.spy();
    });

    afterEach(() => sandbox.restore());

    it('Should find travels as expected', async () => {
      mockTravel
        .expects('findTravels')
        .once()
        .withArgs([2, 1])
        .resolves({ id: 1 });

      const req = { query: { latitude: 1, longitude: 2 } };
      await TravelController.findTravels(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 200, data: { id: 1 } });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });

    it('Should fail', async () => {
      mockTravel
        .expects('findTravels')
        .once()
        .withArgs()
        .rejects();

      const req = { query: { latitude: 1, longitude: 2 } };
      await TravelController.findTravels(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 500, message: 'Unexpected Error' });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });
  });

  describe('findTravel', () => {
    let mockTravel;
    let mockNext;

    let objTest;

    beforeEach(() => {
      objTest = { send: (args) => { return args; } };
      mockTravel = sandbox.mock(TravelService);
      mockNext = sandbox.spy();
    });

    afterEach(() => sandbox.restore());

    it('Should find travel as expected', async () => {
      mockTravel
        .expects('findTravel')
        .once()
        .withArgs(1)
        .resolves({ id: 1 });

      const req = { params: { travelId: 1 } };
      await TravelController.findTravel(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 200, data: { id: 1 } });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });

    it('Should fail', async () => {
      mockTravel
        .expects('findTravel')
        .once()
        .withArgs(1)
        .rejects();

      const req = { params: { travelId: 1 } };
      await TravelController.findTravel(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ message: "Unexpected Error", statusCode: 500 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });
  });

  describe('findTravelsByUserId', () => {
    let mockTravel;
    let mockNext;

    let objTest;

    beforeEach(() => {
      objTest = { send: (args) => { return args; } };
      mockTravel = sandbox.mock(TravelService);
      mockNext = sandbox.spy();
    });

    afterEach(() => sandbox.restore());

    it('Should find travels by user id as expected', async () => {
      mockTravel
        .expects('findTravelsByUserId')
        .once()
        .withArgs(1, { page: 1, limit: 10 })
        .resolves({ data: [], total: 0, page: 1, limit: 10 });

      const req = { params: { userId: 1 }, query: { page: 1, limit: 10 } };
      await TravelController.findTravelsByUserId(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 200, data: [], total: 0, page: 1, limit: 10 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });

    it('Should fail', async () => {
      mockTravel
        .expects('findTravelsByUserId')
        .once()
        .withArgs(1, { page: 1, limit: 10 })
        .rejects();

      const req = { params: { userId: 1 }, query: { page: 1, limit: 10 } };
      await TravelController.findTravelsByUserId(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ message: 'Unexpected Error', statusCode: 500 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });
  });

  describe('createTravel', () => {
    let mockTravel;
    let mockNext;

    let objTest;

    beforeEach(() => {
      objTest = { send: (args) => { return args; } };
      mockTravel = sandbox.mock(TravelService);
      mockNext = sandbox.spy();
    });

    afterEach(() => sandbox.restore());

    it('Should create travel as expected', async () => {
      mockTravel
        .expects('createTravel')
        .once()
        .withArgs({ x: 1, y: 2 })
        .resolves({ result: true });

      const req = { body: { x: 1, y: 2 } };
      await TravelController.createTravel(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 200, data: { result: true } });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });

    it('Should fail', async () => {
      mockTravel
        .expects('createTravel')
        .once()
        .withArgs({ x: 1, y: 2 })
        .rejects();

      const req = { body: { x: 1, y: 2 } };
      await TravelController.createTravel(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ message: "Unexpected Error", statusCode: 500 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });
  });

  describe('patchTravel', () => {
    let mockTravel;
    let mockNext;

    let objTest;

    beforeEach(() => {
      objTest = { send: (args) => { return args; } };
      mockTravel = sandbox.mock(TravelService);
      mockNext = sandbox.spy();
    });

    afterEach(() => sandbox.restore());

    it('Should patch travel as expected', async () => {
      mockTravel
        .expects('patchTravel')
        .once()
        .withArgs(1, { x: 1, y: 2 })
        .resolves({ result: true });

      const req = { params: { travelId: 1 }, body: { x: 1, y: 2 } };
      await TravelController.patchTravel(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 201 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });

    it('Should fail', async () => {
      mockTravel
        .expects('patchTravel')
        .once()
        .withArgs(1, { x: 1, y: 2 })
        .rejects();

      const req = { params: { travelId: 1 }, body: { x: 1, y: 2 } };
      await TravelController.patchTravel(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ message: "Unexpected Error", statusCode: 500 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });
  });

  describe('checkDriverConfirmation', () => {
    let mockTravel;
    let mockNext;

    let objTest;

    beforeEach(() => {
      objTest = { send: (args) => { return args; } };
      mockTravel = sandbox.mock(TravelService);
      mockNext = sandbox.spy();
    });

    afterEach(() => sandbox.restore());

    it('Should patch travel as expected', async () => {
      mockTravel
        .expects('checkDriverConfirmation')
        .once()
        .withArgs(1)
        .resolves({ result: true });

      const req = { params: { travelId: 1 }, body: { x: 1, y: 2 } };
      await TravelController.checkDriverConfirmation(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ statusCode: 200, data: { result: true } });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });

    it('Should fail', async () => {
      mockTravel
        .expects('checkDriverConfirmation')
        .once()
        .withArgs(1)
        .rejects();

      const req = { params: { travelId: 1 }, body: { x: 1, y: 2 } };
      await TravelController.checkDriverConfirmation(req, objTest, mockNext);
      expect(objTest.customResponse).to.deep.equal({ message: "Unexpected Error", statusCode: 500 });
      expect(mockNext.calledOnce).to.equal(true);
      sandbox.verify();
    });
  });
});