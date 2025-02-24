export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function calculateT(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
    const dx = bx - ax;
    const dy = by - ay;
    const len = dx * dx + dy * dy;
    const dot = (px - ax) * dx + (py - ay) * dy;
    return Math.min(1, Math.max(0, dot / len));
}

export function findClosestSegment(xCoords: number[], yCoords: number[], easting: number, northing: number): number {
    let closestSegmentIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < xCoords.length - 1; i++) {
        const x1 = xCoords[i];
        const y1 = yCoords[i];
        const x2 = xCoords[i + 1];
        const y2 = yCoords[i + 1];

        const t = calculateT(easting, northing, x1, y1, x2, y2);

        const closestX = x1 + (x2 - x1) * t;
        const closestY = y1 + (y2 - y1) * t;

        const distance = calculateDistance(easting, northing, closestX, closestY);

        if (distance < minDistance) {
            minDistance = distance;
            closestSegmentIndex = i;
        }
    }

    return closestSegmentIndex;
}

export function findNearestPointOnSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
    const t = calculateT(px, py, ax, ay, bx, by);

    const closestX = ax + (bx - ax) * t;
    const closestY = ay + (by - ay) * t;

    return { x: closestX, y: closestY };
}