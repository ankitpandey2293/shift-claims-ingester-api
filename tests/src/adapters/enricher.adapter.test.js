const { EnricherAdapter } = require('../../../src/adapters');

describe("EnricherAdapter Test Scenario", () => {
    let enricherAdapter = new EnricherAdapter({})
    let orgID = 1;
    let uniqueID = 1;

    afterAll(async () => {
        await enricherAdapter.close()
    });

    test('Instantiating Class', async () => {
        expect(enricherAdapter.config).toBeDefined()
        expect(enricherAdapter.state).toBeDefined()
        expect(enricherAdapter.ClaimsEnricherService).toBeDefined()
        expect(enricherAdapter.packageDefinition).toBeDefined()
    })

    test('Checking if close is a defined function', async () => {
        expect(enricherAdapter.close).toBeDefined()
    })

    test('Checking if init is a defined function', async () => {
        expect(enricherAdapter.init).toBeDefined()
    })

    test('Checking if enrichClaim is a defined function', async () => {
        expect(enricherAdapter.enrichClaim).toBeDefined()
    })

    test('Calling enrichClaim success', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'enrichClaim')
        spy.mockImplementation(({ }, callback) => callback(null, { "uniqueID": "1", "claimName": "Dummy", "verified": true }))
        const data = await enricherAdapter.enrichClaim(orgID, uniqueID)
        expect(data).toBeTruthy()
    })

    test('Calling enrichClaim reject', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'enrichClaim')
        spy.mockImplementation(({ }, callback) => callback(new Error('Enrichment Error')))
        enricherAdapter.enrichClaim(orgID, uniqueID).catch(exception => {
            expect(exception).toBeDefined()
        })

    })

})