import { readCSVFile, treatCSVData } from "./utils/dataUtils";
import { createAndDisplayGraph } from "./service/graphService";
import { calculateDistance, findClosestSegment, findNearestPointOnSegment } from "./utils/mathUtils";

function displayStation(totalDistance: number, offset: number) {
    const distanceElement = document.getElementById('stationAndOffset');
    if (distanceElement) {
        distanceElement.textContent = `Station: ${totalDistance}   Offset: ${offset}`;
    }
}

let csvData: any[] = [];
let file: File | null = null;

document.getElementById('csvFileInput')?.addEventListener('change', async (event: Event) => {
    let inputElement = event.target as HTMLInputElement;
    file = inputElement?.files ? inputElement.files[0] : null;

    if (file && file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please select a valid CSV file.");
        inputElement.value = "";
    }

    csvData = await readCSVFile(file);
});

document.getElementById('computeBtn')?.addEventListener('click', async () => {
    try {

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