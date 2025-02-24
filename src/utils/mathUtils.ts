export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function findClosestSegment(xCoords: number[], yCoords: number[], easting: number, northing: number): number {
    let closestSegmentIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < xCoords.length - 1; i++) {
        const x1 = xCoords[i];
        const y1 = yCoords[i];
        const x2 = xCoords[i + 1];
        const y2 = yCoords[i + 1];

        const dx = x2 - x1;
        const dy = y2 - y1;

        const t = ((easting - x1) * dx + (northing - y1) * dy) / (dx * dx + dy * dy);

        let closestX, closestY;

        if (t < 0) {
            closestX = x1;
            closestY = y1;
        } else if (t > 1) {
            closestX = x2;
            closestY = y2;
        } else {
            closestX = x1 + t * dx;
            closestY = y1 + t * dy;
        }

        const distance = calculateDistance(easting, northing, closestX, closestY);

        if (distance < minDistance) {
            minDistance = distance;
            closestSegmentIndex = i;
        }
    }

    return closestSegmentIndex;
}

export function findNearestPointOnSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
    const atob = { x: bx - ax, y: by - ay };
    const atop = { x: px - ax, y: py - ay };
    const len = (atob.x * atob.x) + (atob.y * atob.y);
    let dot = (atop.x * atob.x) + (atop.y * atob.y);
    const t = Math.min(1, Math.max(0, dot / len));

    dot = ((bx - ax) * (py - ay)) - ((by - ay) * (px - ax));

    return { x: ax + (atob.x * t), y: ay + (atob.y * t) };
}