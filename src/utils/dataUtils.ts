import Papa from "papaparse"

export function readCSVFile(file: File): Promise<any[]> {
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

export function treatCSVData(rawData: any[]): any[] {
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