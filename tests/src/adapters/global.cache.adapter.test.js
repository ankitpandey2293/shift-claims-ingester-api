const { GlobalCache } = require('../../../src/adapters');

describe("GLobalCache Test Scenario", () => {
    let globalCache = new GlobalCache({})
    const res = {
        send: function () { },
        json: function (err) { },
        status: function (responseStatus) { }
    }

    afterAll(async () => {
        await globalCache.close()
    });

    test('Instantiating Class', async () => {
        expect(globalCache.config).toBeDefined()
        expect(globalCache.state).toBeDefined()
    })

    test('Checking if errorHandler is a defined function', async () => {
        expect(globalCache.errorHandler).toBeDefined()
    })

    test('Checking if getClaim is a defined function', async () => {
        expect(globalCache.getClaim).toBeDefined()
    })

    test('Checking if setClaimsBatchMutex is a defined function', async () => {
        expect(globalCache.setClaimsBatchMutex).toBeDefined()
    })

    test('Checking if close is a defined function', async () => {
        expect(globalCache.close).toBeDefined()
    })

    test('Checking if init is a defined function', async () => {
        expect(globalCache.init).toBeDefined()
    })

    test('Checking if deleteKey is a defined function', async () => {
        expect(globalCache.deleteKey).toBeDefined()
    })

    test('Calling errorHandler with maxRetry > 10', async () => {
        globalCache.retryAttempts = 11
        try {
            await globalCache.errorHandler(null)
        } catch (exception) {
            expect(exception).toStrictEqual(new Error("Trouble connecting global cache store"))
        }
    })

    test('Calling errorHandler with maxRetry < 10', async () => {
        const spy = jest.spyOn(globalCache, 'init')
        spy.mockImplementation(async () => { });
        globalCache.retryAttempts = 5
        await globalCache.errorHandler(null)
        expect(spy).toHaveBeenCalled()
    })

    test('Calling getClaim empty key', async () => {
        const data = await globalCache.getClaim(1, 1)
        expect(data).toBeFalsy()
    })

    test('Calling getClaim mocked value', async () => {
        const spy = jest.spyOn(globalCache.client, 'get')
        spy.mockImplementation(async () => { return `{"uniqueID":"1","claimName":"Dummy","verified": true }` });
        const data = await globalCache.getClaim(1, 1)
        expect(data).toBeTruthy()
    })

    test('Calling setClaimsBatchMutex first time', async () => {
        await globalCache.deleteKey(`1:CL:MX:1`)
        const data = await globalCache.setClaimsBatchMutex(1, 1)
        expect(data).toBeTruthy()
    })

    test('Calling setClaimsBatchMutex second time', async () => {
        const data = await globalCache.setClaimsBatchMutex(1, 1)
        expect(data).toBeFalsy()
    })

})