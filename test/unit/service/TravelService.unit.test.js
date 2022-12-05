/* eslint-disable no-undef */
// Testing
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;
const sandbox = require('sinon');

// Repositories
const TravelRepository = require('../../../src/repository/TravelRepository');

// services
const TravelService = require('../../../src/service/TravelService');

describe('TravelService Unit Tests', () => {
  describe('findTravels', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call get travels as expected', async () => {
      travelRepository
        .expects('findTravels')
        .once()
        .withArgs([1, 2])
        .resolves({
          _doc: {
            source: {
              coordinates: [2, 2]
            },
            destination: {
              coordinates: [29, 20]
            },
            currentDriverPosition: null
          }
        });

      const travel = await TravelService.findTravels([1, 2]);
      expect(travel).to.deep.equal({
        source: { latitude: 2, longitude: 2 },
        destination: { latitude: 20, longitude: 29 },
        currentDriverPosition: {
          latitude: null,
          longitude: null
        }
      });
    });
  });

  describe('findTravel', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call get travel as expected', async () => {
      travelRepository
        .expects('findTravel')
        .once()
        .withArgs(1)
        .resolves({
          _doc: {
            source: {
              coordinates: [2, 2]
            },
            destination: {
              coordinates: [29, 20]
            },
            currentDriverPosition: {
              coordinates: [100, 100]
            }
          }
        });

      const travel = await TravelService.findTravel(1);
      expect(travel).to.deep.equal({
        source: { latitude: 2, longitude: 2 },
        destination: { latitude: 20, longitude: 29 },
        currentDriverPosition: {
          latitude: 100,
          longitude: 100
        }
      });
    });
  });

  describe('findTravelsByUserId', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should find travels by user id as expected', async () => {
      travelRepository
        .expects('findTravelsByUserId')
        .once()
        .withArgs(1, { page: 1, limit: 1 })
        .resolves({
          data: [{
            _doc: {
              source: {
                coordinates: [2, 2]
              },
              destination: {
                coordinates: [29, 20]
              },
              currentDriverPosition: {
                coordinates: [100, 100]
              }
            }
          }],
          total: 1,
          page: 1,
          limit: 1
        });

      const travel = await TravelService.findTravelsByUserId(1, { page: 1, limit: 1 });
      expect(travel).to.deep.equal({
        data: [
          {
            source: { latitude: 2, longitude: 2 },
            destination: { latitude: 20, longitude: 29 },
            currentDriverPosition: {
              latitude: 100,
              longitude: 100
            }
          }
        ],
        total: 1,
        page: 1,
        limit: 1
      });
    });

    it('Should not find any travel', async () => {
      travelRepository
        .expects('findTravelsByUserId')
        .once()
        .withArgs(1, { page: 1, limit: 1 })
        .resolves({
          data: [],
          total: 0,
          page: 1,
          limit: 1
        });

      const travel = await TravelService.findTravelsByUserId(1, { page: 1, limit: 1 });
      expect(travel).to.deep.equal({
        data: [],
        total: 0,
        page: 1,
        limit: 1
      });
    });
  });

  describe('createTravel', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should call create travel as expected', async () => {
      const expectedArgs = {
        source: { type: 'Point', coordinates: [2, -150] },
        destination: { type: 'Point', coordinates: [2, 1] },
        userId: 1,
        price: 500,
        date: '2022-10-17T00:47:48',
        status: 'searching_driver'
      };

      travelRepository
        .expects('createTravel')
        .once()
        .withArgs(expectedArgs)
        .resolves({
          _doc: {
            source: { coordinates: [2, 2] },
            destination: { coordinates: [29, 20] },
            currentDriverPosition: { coordinates: [100, 100] }
          }
        });

      const body = {
        userId: 1,
        price: 500,
        source: { latitude: -150, longitude: 2 },
        destination: { latitude: 1, longitude: 2 },
        date: '2022-10-17T00:47:48'
      };

      const travel = await TravelService.createTravel(body);
      expect(travel).to.deep.equal({
        source: { latitude: 2, longitude: 2 },
        destination: { latitude: 20, longitude: 29 },
        currentDriverPosition: { latitude: 100, longitude: 100 }
      });
    });
  });

  describe('patchTravel', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should patch driverId as expected', async () => {
      const expectedArgs = {
        driverId: 1,
        currentDriverPosition: {
          type: 'Point', coordinates: [100, 100]
        }
      };

      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, expectedArgs)
        .resolves({});

      const body = {
        driverId: 1,
        currentDriverPosition: {
          latitude: 100,
          longitude: 100
        }
      };

      const travel = await TravelService.patchTravel(10, body);
      expect(travel).to.deep.equal({});
    });

    it('Should patch currentDriverPosition as expected', async () => {
      const expectedArgs = {
        currentDriverPosition: { type: 'Point', coordinates: [543, 123] }
      };

      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, expectedArgs)
        .resolves({});

      const body = {
        currentDriverPosition: {
          latitude: 123,
          longitude: 543
        },
        random: 1
      };

      const travel = await TravelService.patchTravel(10, body);
      expect(travel).to.deep.equal({});
    });

    it('Should patch random as expected', async () => {
      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, { args: true })
        .resolves({});

      const travel = await TravelService.patchTravel(10, { args: true });
      expect(travel).to.deep.equal({});
    });
  });

  describe('checkDriverConfirmation', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should check driver confirmation as expected', async () => {
      travelRepository
        .expects('checkDriverConfirmation')
        .once()
        .withArgs(10)
        .resolves({
          driverId: 1,
          currentDriverPosition: {
            coordinates: [2, 1]
          }
        });

      const travel = await TravelService.checkDriverConfirmation(10);
      expect(travel).to.deep.equal({
        driverId: 1,
        currentDriverPosition: {
          latitude: 1,
          longitude: 2
        }
      });
    });
  });
  describe('Accept travel should change the state of travel', () => {
    const body = {
      driverId: 1,
      currentDriverPosition: {
        latitude: 100,
        longitude: 100
      }
    };
    const expectedArgs = {

      status: 'waiting_driver',
      driverId: 1,
      currentDriverPosition: {
        type: 'Point', coordinates: [100, 100]
      }
    };
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should accept travel as expected', async () => {
      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs('10', expectedArgs)
        .resolves({});

      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'searching_driver'
        });

      const travel = await TravelService.acceptTravel('10', body);
      expect(travel).to.deep.equal({});
      sandbox.verify();
    });
    it('Should fail accept', async () => {
      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'finished'
        });

      await TravelService
        .acceptTravel('10')
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.be.equal('Para aceptar un viaje, este debe estar en estado SEARCHING DRIVER');
        });
      sandbox.verify();
    });
  });
  describe('Reject travel should change the state of travel', () => {
    const expectedArgs = {
      status: 'cancelled',
      driverId: null,
      currentDriverPosition: null
    };
    let travelRepository;
    let travelService;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
      travelService = sandbox.mock(TravelService);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should reject travel as expected', async () => {
      travelService
        .expects('setStateTravelByTravelId')
        .once()
        .withArgs('10', expectedArgs, false)
        .resolves({});

      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'waiting_driver'
        });

      const travel = await TravelService.rejectTravel('10');
      expect(travel).to.deep.equal({});
      sandbox.verify();
    });
    it('Should fail rejecting', async () => {
      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'finished'
        });

      await TravelService
        .rejectTravel('10')
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.be.equal('Para iniciar un viaje, este debe estar en estado SEARCHING DRIVER o WAITING DRIVER');
        });
      sandbox.verify();
    });
  });
  describe('Start travel should change the state of travel', () => {
    const expectedArgs = {
      status: 'started'
    };
    let travelRepository;
    let travelService;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
      travelService = sandbox.mock(TravelService);
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('Should start travel as expected', async () => {
      travelService
        .expects('setStateTravelByTravelId')
        .once()
        .withArgs('10', expectedArgs, false)
        .resolves({});

      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'waiting_driver'
        });

      const travel = await TravelService.startTravel('10');
      expect(travel).to.deep.equal({});
      sandbox.verify();
    });
    it('Should fail start', async () => {
      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'finished'
        });

      await TravelService
        .startTravel('10')
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.be.equal('Para iniciar un viaje, este debe estar en estado WAITING DRIVER');
        });
      sandbox.verify();
    });
  });
  describe('Finish travel should change the state of travel', () => {
    const expectedArgs = {
      status: 'finished'
    };
    let travelRepository;
    let travelService;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
      travelService = sandbox.mock(TravelService);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should finish travel as expected', async () => {
      travelService
        .expects('setStateTravelByTravelId')
        .once()
        .withArgs('10', expectedArgs)
        .resolves({});

      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'started'
        });

      const travel = await TravelService.finishTravel('10');
      expect(travel).to.deep.equal({});
      sandbox.verify();
    });
    it('Should fail finish', async () => {
      travelRepository.expects('findTravel')
        .once()
        .withArgs('10')
        .resolves({
          status: 'finished'
        });

      await TravelService
        .finishTravel('10')
        .then(() => { throw new Error(); })
        .catch(err => {
          expect(err.message).to.be.equal('Para iniciar un viaje, este debe estar en estado STARTED');
        });
      sandbox.verify();
    });
  });
  describe('Set User Score by Travel Id should patch as expected', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should check driver confirmation as expected', async () => {
      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, { userScore: 10 })
        .resolves({});

      const travel = await TravelService.setUserScoreByTravelId(10, 10);
      expect(travel).to.deep.equal({ });
    });
  });
  describe('Set Driver Score by Travel Id should patch as expected', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should check driver confirmation as expected', async () => {
      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, { driverScore: 10 })
        .resolves({});

      const travel = await TravelService.setDriverScoreByTravelId(10, 10);
      expect(travel).to.deep.equal({ });
    });
  });
  describe('Set Driver Score by Travel Id should patch as expected', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('Should check driver confirmation as expected', async () => {
      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, { state: 'waiting_driver' })
        .resolves({});

      const travel = await TravelService.setStateTravelByTravelId(10, { state: 'waiting_driver' }, false);
      expect(travel).to.deep.equal({ });
    });
  });
});
