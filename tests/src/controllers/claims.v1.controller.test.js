const { QueuePublisher } = require('../../../src/adapters')
jest.genMockFromModule('../../../src/adapters/queue.publisher.adapter');
jest.mock('../../../src/adapters/queue.publisher.adapter');
const { ClaimsControllerV1 } = require('../../../src/controllers');

const mockQueuePublisher = {
    dispatchEvent: jest.fn(),
    setupConnection: jest.fn()
};

QueuePublisher.mockImplementation(() => mockQueuePublisher);


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (data) => {
    return data;
};


describe("ClaimsControllerV1 Test Scenario", () => {

    let claimsControllerV1 = new ClaimsControllerV1({
        state: {}, config: {}
    })

    const res = {
        send: function () { },
        json: function (err) { },
        status: function (responseStatus) { }
    }
    const spy = jest.spyOn(claimsControllerV1.enricherAdapter, 'enrichClaim')
    spy.mockImplementation(async () => { return { "uniqueID": "1", "claimName": "Dummy", "verified": true } });


    afterAll(async () => {
        await Promise.allSettled([
            claimsControllerV1.globalCache.close(),
            claimsControllerV1.enricherAdapter.close()
        ]);
    })

    test('Instantiating Class ClaimsControllerV1', async () => {
        expect(claimsControllerV1.config).toBeDefined()
        expect(claimsControllerV1.state).toBeDefined()
    })

    test('Checking defined functions', async () => {

        expect(claimsControllerV1.getClaim).toBeDefined()
        expect(claimsControllerV1.saveClaims).toBeDefined()
    })

    test('Calling getClaim', async () => {

        expect(await claimsControllerV1.getClaim({ headers: { orgID: 1 }, params: { id: 1 } }, res));
    })

    test('Calling saveClaims Idempotent Check False', async () => {
        const spy1 = jest.spyOn(claimsControllerV1.globalCache, 'setClaimsBatchMutex')
        spy1.mockImplementation(async () => { return false });
        const req = mockRequest({ headers: { orgID: 1 }, body: { request_id: "test", claims: [{ uniqueID: 100, claimName: "Dummy", verified: true }] } });
        const res = mockResponse();
        await claimsControllerV1.saveClaims(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    test('Calling saveClaims Idempotent Check true with insertion success', async () => {
        const spy1 = jest.spyOn(claimsControllerV1.globalCache, 'setClaimsBatchMutex')
        spy1.mockImplementation(async () => { return true });

        const spy2 = jest.spyOn(claimsControllerV1.enricherAdapter, 'saveClaim')
        spy2.mockImplementation(async ({ }) => { return { uniqueID: 200 } });

        const req = mockRequest({ headers: { orgID: 1 }, body: { request_id: "test2", claims: [{ uniqueID: 200, claimName: "Dummy", verified: true }] } });
        const res = mockResponse();

        await claimsControllerV1.saveClaims(req, res)
        expect(res.send).toBeDefined()
    });

    test('Calling saveClaims Idempotent Check true with insertion rejection', async () => {
        const spy1 = jest.spyOn(claimsControllerV1.globalCache, 'setClaimsBatchMutex')
        spy1.mockImplementation(async () => { return true });

        const spy2 = jest.spyOn(claimsControllerV1.enricherAdapter, 'saveClaim')
        spy2.mockImplementation(async ({ }) => { throw { uniqueID: 200 } });

        const req = mockRequest({ headers: { orgID: 1 }, body: { request_id: "test2", claims: [{ uniqueID: 200, claimName: "Dummy", verified: true }] } });
        const res = mockResponse();

        await claimsControllerV1.saveClaims(req, res)
        expect(res.send).toBeDefined()
    });

    test('Calling getClaim exception', async () => {
        const spy1 = jest.spyOn(claimsControllerV1.globalCache, 'getClaim')
        spy1.mockImplementation(async () => { return null });

        const spy2 = jest.spyOn(claimsControllerV1.enricherAdapter, 'enrichClaim')
        spy2.mockImplementation(async ({ }) => { throw { code: 400, message: "Internal Error" } });

        const req = mockRequest({ headers: { orgID: 1 }, params: { id: 200 } });
        const res = mockResponse();

        await claimsControllerV1.getClaim(req, res)
        expect(res.send).toBeDefined()
    });
})