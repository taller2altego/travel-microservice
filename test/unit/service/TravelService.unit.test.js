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

describe("TravelService Unit Tests", () => {

  // let travelRepository;

  // beforeEach(() => {
  //   travelRepository = sandbox.mock(TravelRepository);
  // });

  // afterEach(() => {
  //   sandbox.restore();
  // })

  // describe("find tickets", () => {

  //   it("Should call get tickets as expected", async () => {
  //     travelRepository
  //       .expects('getTickets')
  //       .once()
  //       .withArgs()
  //       .resolves([1, 2]);

  //     const tickets = await TicketService.getTickets();
  //     expect(tickets).to.deep.equal([1, 2]);
  //   });
  // });

  // describe("create ticket", () => {

  //   it("Should call create tickets as expected", async () => {
  //     travelRepository
  //       .expects('createTicket')
  //       .once()
  //       .withArgs()
  //       .resolves([1, 2]);

  //     const tickets = await TicketService.createTicket();
  //     expect(tickets).to.deep.equal([1, 2]);
  //   });
  // });

  describe('findTravels', () => {
    let travelRepository;

    beforeEach(() => {
      travelRepository = sandbox.mock(TravelRepository);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("Should call get travels as expected", async () => {
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
              coordinates: [20, 29]
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

    it("Should call get travel as expected", async () => {
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
              coordinates: [20, 29]
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

    it("Should find travels by user id as expected", async () => {
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
                coordinates: [20, 29]
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

    it("Should not find any travel", async () => {
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

    it("Should call create travel as expected", async () => {

      const expectedArgs = {
        source: { type: 'Point', coordinates: [-150, 2] },
        destination: { type: 'Point', coordinates: [1, 2] },
        userId: 1,
        price: 500,
        date: "2022-10-17T00:47:48"
      };

      travelRepository
        .expects('createTravel')
        .once()
        .withArgs(expectedArgs)
        .resolves({
          _doc: {
            source: { coordinates: [2, 2] },
            destination: { coordinates: [20, 29] },
            currentDriverPosition: { coordinates: [100, 100] }
          }
        });

      const body = {
        userId: 1,
        price: 500,
        source: { latitude: -150, longitude: 2 },
        destination: { latitude: 1, longitude: 2 },
        date: "2022-10-17T00:47:48"
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

    it("Should patch driverId as expected", async () => {
      const expectedArgs = {
        driverId: 1
      };

      travelRepository
        .expects('patchTravel')
        .once()
        .withArgs(10, expectedArgs)
        .resolves({});

      const body = {
        driverId: 1,
        random: 1
      };

      const travel = await TravelService.patchTravel(10, body);
      expect(travel).to.deep.equal({});
    });

    it("Should patch currentDriverPosition as expected", async () => {
      const expectedArgs = {
        currentDriverPosition: { type: 'Point', coordinates: [123, 543] }
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

    it("Should patch random as expected", async () => {
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

    it("Should check driver confirmation as expected", async () => {
      travelRepository
        .expects('checkDriverConfirmation')
        .once()
        .withArgs(10)
        .resolves({
          driverId: 1,
          currentDriverPosition: {
            coordinates: [1, 2]
          }
        });

      const travel = await TravelService.checkDriverConfirmation(10);
      expect(travel).to.deep.equal({
        driver: 1,
        currentDriverPosition: {
          latitude: 1,
          longitude: 2
        }
      });
    });

    // it("Should patch currentDriverPosition as expected", async () => {
    //   const expectedArgs = {
    //     currentDriverPosition: { type: 'Point', coordinates: [123, 543] }
    //   };

    //   travelRepository
    //     .expects('checkDriverConfirmation')
    //     .once()
    //     .withArgs(10, expectedArgs)
    //     .resolves({});

    //   const travel = await TravelService.checkDriverConfirmation(10);
    //   expect(travel).to.deep.equal({
    //     driver: 1,
    //     currentDriverPosition: {
    //       latitude: 1,
    //       longitude: 2
    //     }
    //   });
    // });
  });
});
