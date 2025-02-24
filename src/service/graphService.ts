import Plotly from 'plotly.js-dist-min';

export function createAndDisplayGraph(data: { x: number[], y: number[] }, easting: number, northing: number, cx: number, cy: number) {
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