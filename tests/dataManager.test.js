const fs = require('fs');
const dataManager = require('../dataManager');

jest.mock('fs');

describe('dataManager', () => {
    test('reads JSON data', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue('{"test": "data"}');
        const data = dataManager.readJSON('test.json');
        expect(data).toEqual({ test: 'data' });
    });

    test('writes JSON data', () => {
        const data = { test: 'data' };
        dataManager.writeJSON('test.json', data);
        expect(fs.writeFileSync).toHaveBeenCalledWith('test.json', JSON.stringify(data, null, 2));
    });

    test('returns empty object if file does not exist', () => {
        fs.existsSync.mockReturnValue(false);
        const data = dataManager.readJSON('test.json');
        expect(data).toEqual({});
    });
});
