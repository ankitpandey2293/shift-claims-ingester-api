const { ResponseHelper } = require('../../../src/helpers');

describe("ResponseHelper Test Scenario", () => {

    test('Validating Exports : success', async () => {
        expect(ResponseHelper.success).toBeDefined()
    })

    test('Validating Exports : error', async () => {
        expect(ResponseHelper.error).toBeDefined()
    })

    test('Validating Exports : FormattedResponse', async () => {
        expect(ResponseHelper.FormattedResponse).toBeDefined()
    })

    test('Calling exports error', async () => {
        expect(ResponseHelper.error('Test', 400)).toBeDefined();
        expect(ResponseHelper.error('Test', 400)).toStrictEqual({
            message: 'Test',
            code: 400,
            error: true
        });
    })

    test('Calling exports success', async () => {
        expect(ResponseHelper.success({}, 'Test', 200)).toBeDefined();
        expect(ResponseHelper.success({}, 'Test', 200)).toStrictEqual({
            data: {},
            message: 'Test',
            code: 200,
            error: false
        });
    })

    test('Calling exports success empty code', async () => {
        expect(ResponseHelper.success({}, 'Test')).toBeDefined();
        expect(ResponseHelper.success({}, 'Test')).toStrictEqual({
            data: {},
            message: 'Test',
            code: 200,
            error: false
        });
    })

})