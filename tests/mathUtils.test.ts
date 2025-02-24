import { calculateDistance, findClosestSegment, getClosestPointOnSegment } from '../src/utils/mathUtils';

describe('Testing math operations related functions...', () => {
    test('Calculate the euclidean distance between two points', () => {

        expect(calculateDistance(0, 0, 3, 4)).toBe(5);
    });

    test('Return the index of the closest segment', () => {
        const xCoords = [0, 10, 20];
        const yCoords = [0, 0, 0];
        const easting = 5;
        const northing = 5;

        const result = findClosestSegment(xCoords, yCoords, easting, northing);
        expect(result).toBe(0);
    });

    test('Return the closest point on segment', () => {
        const result = getClosestPointOnSegment(5, 5, 0, 0, 10, 0);
        expect(result).toEqual({ x: 5, y: 0 });
    });
});