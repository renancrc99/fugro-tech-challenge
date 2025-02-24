import { readCSVFile } from '../src/utils/csvUtils';
import Papa from 'papaparse';

jest.mock('papaparse', () => ({
    parse: jest.fn()
}));

describe('Testing csv reader function...', () => {
    test('Read the CSV file data', async () => {
        (Papa.parse as jest.Mock).mockImplementation((file, mockedPapa) => {
            
            mockedPapa.complete({ data: [['1', '2'], ['3', '4']] });
        });

        const mockFile = {} as File;

        const result = await readCSVFile(mockFile);
        expect(result).toEqual([['1', '2'], ['3', '4']]);
    });
});