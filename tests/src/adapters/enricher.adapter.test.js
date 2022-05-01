const { EnricherAdapter } = require('../../../src/adapters');

describe("EnricherAdapter Test Scenario", () => {
    let enricherAdapter = new EnricherAdapter({})
    let orgID = 1;
    let uniqueID = 1;
    let claimName = "Dummy";
    let verified = true;

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

    test('Checking if saveClaim is a defined function', async () => {
        expect(enricherAdapter.saveClaim).toBeDefined()
    })

    test('Calling enrichClaim success', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'enrichClaim')
        spy.mockImplementation(({ }, callback) => callback(null, { "uniqueID": "1", "claimName": "Dummy", "verified": true }))
        const data = await enricherAdapter.enrichClaim(orgID, uniqueID)
        expect(data).toBeTruthy()
    })

    test('Calling enrichClaim reject scenario 1', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'enrichClaim')
        spy.mockImplementation(({ }, callback) => callback(new Error('Enrichment Error')))
        enricherAdapter.enrichClaim(orgID, uniqueID).catch(exception => {
            expect(exception).toBeDefined()
        })

    })

    test('Calling enrichClaim reject scenario 2', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'enrichClaim')
        spy.mockImplementation(({ }, callback) => callback({ code: 3 }))
        enricherAdapter.enrichClaim(orgID, uniqueID).catch(exception => {
            expect(exception).toBeDefined()
        })

    })

    test('Calling saveClaim success', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'saveClaim')
        spy.mockImplementation(({ }, callback) => callback(null, {}))
        enricherAdapter.saveClaim(orgID, { uniqueID, claimName, verified }).catch(exception => {
            expect(exception).not.toBeDefined()
        }).then(data => {
            expect(data).toBeDefined()
        })
    })

    test('Calling saveClaim reject', async () => {
        const spy = jest.spyOn(enricherAdapter.client, 'saveClaim')
        spy.mockImplementation(({ }, callback) => callback(new Error('Duplicate Claim Submission')))
        enricherAdapter.saveClaim(orgID, { uniqueID, claimName, verified }).catch(exception => {
            expect(exception).toBeDefined()
        })

    })

})