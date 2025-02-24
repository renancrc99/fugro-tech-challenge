import { createGraph } from '../src/utils/graphUtils';
import Plotly from 'plotly.js-dist-min'

jest.mock('plotly.js-dist-min', () => ({
    newPlot: jest.fn()
}));

describe('createGraph', () => {
    test('Verify if createGraph is being called correctly', () => {
        const data = { x: [1, 2, 3], y: [4, 5, 6] };
        const easting = 10;
        const northing = 15;
        const cx = 20;
        const cy = 25;

        createGraph(data, easting, northing, cx, cy);

        expect(Plotly.newPlot).toHaveBeenCalledWith(
            'polylineGraph',
            expect.any(Array), 
            expect.objectContaining({ title: 'Polyline' })
        );
    });
});