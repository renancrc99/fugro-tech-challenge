# Offset and Station Calculator

This project processes coordinate data from a CSV file and computes offset, station, and generates a graph to display the coordinates. The application is built using TypeScript that is transpiled into Javascript code to be run in a script inside a html file. Below are the steps for setting up and using the project.

## Requirements

The project requires npm which can be downloaded with node, which can be found here: [Node.js](https://nodejs.org/en/download)

## First Steps: Setting up the Project

### 1. Install Dependencies

Before you can run the project, you need to install the required dependencies. Open a terminal in the project root directory and run:

```bash
npm install
```

### 2. Build the TypeScript Code

Next, you'll need to transpile the TypeScript code into JavaScript so that the html can run the js file, to do this run:

```bash
npm run build
```

### 3. Start the Project

Finally, we can start the project and run the application, in your terminal:

```bash
npm run start
```

## Operating the program

### 1. Select a .csv file

Choose a csv file in your computer containing the X and Y coordinates to plot the polyline.

### 2. Enter the Easting and Northing coordinate values

Input the easting and northing values to plot a user point in the graph. It'll be used as a reference for the offset and station calculations.

### 3. Press the Compute button

Finally, just press the "Compute" button to calculate offset and station values, and to generate the graph.

## Testing

This project contains unit tests for validation of basic function operations. To run the tests in your machine, run this command in your terminal:

```bash
npm run test
```
