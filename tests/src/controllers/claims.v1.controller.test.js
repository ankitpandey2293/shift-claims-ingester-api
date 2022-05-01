const { ClaimsControllerV1 } = require('../../../src/controllers');

describe("ClaimsControllerV1 Test Scenario", () => {
    const claimsControllerV1 = new ClaimsControllerV1({})
    const res = {
        send: function () { },
        json: function (err) { },
        status: function (responseStatus) { }
    }
    const spy = jest.spyOn(claimsControllerV1.enricherAdapter, 'enrichClaim')
    spy.mockImplementation(async () => { return { "uniqueID": "1", "claimName": "Dummy", "verified": true } });

    afterAll(async () => {
        await claimsControllerV1.globalCache.close()
        await claimsControllerV1.enricherAdapter.close()
    })

    test('Instantiating Class', async () => {
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

    test('Calling saveClaims', async () => {

        expect(await claimsControllerV1.saveClaims({ headers: { orgID: 1 }, body: { request_id: 1, claims: [{ id: 1, claimName: "Dummy", verified: true }] } }, res));
    })
})