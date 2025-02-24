function readCSVFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            delimiter: ',',
            header: false,
            skipEmptyLines: true,
            complete: (result) => {
                resolve(result.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

function treatCSVData(rawData: any[]): any[] {
    return rawData.map((row) => {
        let [col1, col2] = row;

        if (col1 === "" || col2 === "") {
            return [0, 0];
        }

        col1 = isNaN(parseFloat(col1)) ? 0 : parseFloat(col1);
        col2 = isNaN(parseFloat(col2)) ? 0 : parseFloat(col2);

        return [col1, col2];
    })
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function findClosestSegment(xCoords: number[], yCoords: number[], easting: number, northing: number): number {
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

function findNearestPointOnSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
    const atob = { x: bx - ax, y: by - ay };
    const atop = { x: px - ax, y: py - ay };
    const len = (atob.x * atob.x) + (atob.y * atob.y);
    let dot = (atop.x * atob.x) + (atop.y * atob.y);
    const t = Math.min(1, Math.max(0, dot / len));

    dot = ((bx - ax) * (py - ay)) - ((by - ay) * (px - ax));

    return { x: ax + (atob.x * t), y: ay + (atob.y * t) };
}

function createAndDisplayGraph(data: { x: number[], y: number[] }, easting: number, northing: number, cx: number, cy: number) {
    const line: Partial<Plotly.ScatterData> = {
        x: data.x,
        y: data.y,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'red' },
        name: 'Polyline' 
    };

    const point: Partial<Plotly.ScatterData> = {
        x: [easting],
        y: [northing],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: 'blue',
            size: 5,
            symbol: 'circle'
        },
        name: 'User Point' 
    };

    const offset: Partial<Plotly.ScatterData> = {
        x: [easting, cx],
        y: [northing, cy],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'green', dash: 'dashdot' },
        name: 'Offset' 
    };


    const layout = {
        title: 'Polyline',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' }
    };

    Plotly.newPlot('polylineGraph', [line, point, offset], layout);
}

function displayStation(totalDistance: number, offset: number) {
    const distanceElement = document.getElementById('stationAndOffset');
    if (distanceElement) {
        distanceElement.textContent = `Station: ${totalDistance}   Offset: ${offset}`;
    }
}

let csvData: any[] = [];
let file: File | null = null;

document.getElementById('csvFileInput')?.addEventListener('change', async (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    file = inputElement?.files ? inputElement.files[0] : null;

    csvData = await readCSVFile(file);
});

document.getElementById('computeBtn')?.addEventListener('click', async () => {
    try {
        if (!file) {
            console.error('No CSV file selected. Please upload a file first.');
            return;
        }

        const treatedData = treatCSVData(csvData);

        const xCoords = treatedData.map((item) => parseFloat(item[0]));
        const yCoords = treatedData.map((item) => parseFloat(item[1]));

        let eastingValue = parseFloat((document.getElementById('eastingValue') as HTMLInputElement).value) || 0;
        let northingValue = parseFloat((document.getElementById('northingValue') as HTMLInputElement).value) || 0;

        const closestSegmentIndex = findClosestSegment(xCoords, yCoords, eastingValue, northingValue);

        let distanceOnPolyline = 0;

        for (let i = 1; i <= closestSegmentIndex; i++) {
            distanceOnPolyline += calculateDistance(xCoords[i - 1], yCoords[i - 1], xCoords[i], yCoords[i]);
        }

        const x1 = xCoords[closestSegmentIndex];
        const y1 = yCoords[closestSegmentIndex];
        const x2 = xCoords[closestSegmentIndex + 1];
        const y2 = yCoords[closestSegmentIndex + 1];

        const closestPoint = findNearestPointOnSegment(eastingValue, northingValue, x1, y1, x2, y2);

        const offset = calculateDistance(closestPoint.x, closestPoint.y, eastingValue, northingValue);

        const distanceClosestSegmentToOffset = calculateDistance(x1, y1, closestPoint.x, closestPoint.y);

        const station = distanceOnPolyline + offset + distanceClosestSegmentToOffset;

        createAndDisplayGraph({ x: xCoords, y: yCoords }, eastingValue, northingValue, closestPoint.x, closestPoint.y);

        displayStation(station, offset);
        
    } catch (error) {
        console.error(`Error while processing data: ${error}`);
    }
});
