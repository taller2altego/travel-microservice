// // Testing
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
// const { expect } = chai;
// const sandbox = require('sinon');

// // Service
// const TicketService = require('../../../src/service/ticket/TicketService');

// // controller
// const TicketController = require('../../../src/controller/ticket/TicketController');

// describe('TicketController Test Suite', () => {

//   afterEach(sandbox.restore);

//   describe('Get Tickets', () => {
//     let mockTicket;
//     let mockResponse;
//     let mockNext;

//     let objTest;
//     let nextTest;

//     beforeEach(() => {
//       objTest = { send: (args) => { return args; } };
//       mockTicket = sandbox.mock(TicketService);
//       mockResponse = sandbox.mock(objTest);
//       mockNext = sandbox.spy();
//     });

//     afterEach(() => sandbox.restore());

//     it('Should call ticket models as expected', async () => {
//       mockTicket
//         .expects('getTickets')
//         .once()
//         .withArgs()
//         .resolves([1, 2, 3]);

//       mockResponse
//         .expects('send')
//         .once()
//         .withArgs([1, 2, 3])
//         .resolves(true);

//       expect(mockNext.calledOnce).to.equal(true);

//       await TicketController.getTickets({}, objTest, nextTest);
//       sandbox.verify();
//     });
//   });

//   describe('Create Ticket', () => {
//     let mockTicket;
//     let mockResponse;
//     let objTest;

//     beforeEach(() => {
//       objTest = { send: () => ({ status: (value) => value }) };
//       mockTicket = sandbox.mock(TicketService);
//       mockResponse = sandbox.mock(objTest);
//     });

//     afterEach(() => sandbox.restore());

//     it('Should call createTicket models as expected', async () => {
//       mockTicket
//         .expects('createTicket')
//         .once()
//         .withArgs({ title: 'title', description: 'asd' })
//         .resolves({ id: 1 });

//       mockResponse
//         .expects('send')
//         .once()
//         .withArgs({ id: 1})
//         .returns({ status: () => { } });

//       await TicketController.createTicket({ body: { title: 'title', description: 'asd' } }, objTest);
//       sandbox.verify();
//     });
//   });
// });