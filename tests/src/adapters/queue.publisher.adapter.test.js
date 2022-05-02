const { QueuePublisher } = require('../../../src/adapters');

describe("QueuePublisher Test Scenario", () => {
    let queuePublisher = new QueuePublisher()
    let orgID = 1;
    let uniqueID = 1;
    let claimName = "Dummy";
    let verified = true;

    afterAll(async () => {
        await queuePublisher.close()
        queuePublisher.chanel = {}
        queuePublisher.conn = {}
    });

    test('Instantiating Class', async () => {
        expect(queuePublisher.config).toBeUndefined()
        expect(queuePublisher.state).toBeUndefined()
        expect(queuePublisher.uri).toBeDefined()
        expect(queuePublisher.chanel).toBeUndefined()
        expect(queuePublisher.q).toBeDefined()
    })

    test('Checking if close is a defined function', async () => {
        expect(queuePublisher.close).toBeDefined()
    })

    test('Checking if setupConnection is a defined function', async () => {
        expect(queuePublisher.setupConnection).toBeDefined()
    })

    test('Checking if dispatchBatch is a defined function', async () => {
        expect(queuePublisher.dispatchBatch).toBeDefined()
    })

    test('Checking if send is a defined function', async () => {
        expect(queuePublisher.send).toBeDefined()
    })

    test('Checking if promiseAll is a defined function', async () => {
        expect(queuePublisher.promiseAll).toBeDefined()
    })


    test('Calling dispatchBatch success', async () => {
        const spy = jest.spyOn(queuePublisher, 'send')
        spy.mockImplementation(async () => true)
        expect(queuePublisher.dispatchBatch(orgID, [{ uniqueID, claimName, verified }])).resolves.toBe(undefined)
    })

    test('Calling send success', async () => {
        expect(queuePublisher.send({ uniqueID, claimName, verified })).resolves.toBe(true)
    })
})