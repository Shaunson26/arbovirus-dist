/**
 * Arbovirus chart visualisation
 * 
 * Indicator by locations. Allow multiple locations to be selected for a given
 * indicator
 * 
 */

import { selectorDataAndIds } from "../selectorDataAndIds.js"

let chartContainerId = 'chart-container-by-location'

let layoutDefault = {
    title: "1 indicator, multiple locations",
    margin: { t: 30, b: 30, l: 30, r: 0 },
    xaxis: {
        ticklen: 4,
        showgrid: false,
        // tickformat: '%d %b \n %Y',
        tickangle: 0
    },
    yaxis: {
        ticklen: 4,
        tickcolor: 'white',
        rangemode: 'tozero',
        fixedrange: true

    },
    legend: {
        orientation: 'v'
    }
}

let configDefault = {
    responsive: true,
    hovermode: 'closest',
    modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d']
}

Plotly.newPlot(
    chartContainerId,
    [],
    layoutDefault,
    configDefault
);


/** Update line chart with new data
 * 
 * @param {Array} data 
 * @returns Nothing, will exit early if no update requird
 */
function updateLineChart(data, config) {

    // Get date and value to show ----
    let year = config.year
    let indicator = config.indicator[0]
    let locationsSelected = config.location

    // Update visualisation
    let dataSelected =
        data
            .filter(row => locationsSelected.includes(row.location))

    dataSelected = splitBy(dataSelected, 'location')

    // Traces
    let newTraces =
        dataSelected.map((locationRow, i) => {

            let trace = {
                x: locationRow.map(v => new Date(v.weekendDate)),
                y: locationRow.map((v) => v[indicator]),
                type: 'scatter',
                line: { shape: 'vh' },
                name: locationRow[0].location
            }

            trace.y[10] = null

            if (i > 0) {
                trace.xaxis = 'x'
                trace.yaxis = 'y' + (i + 1)
            }

            return trace

        })


    // Layout
    let legend_group =
        selectorDataAndIds.indicators.filter(v => v.indicator == indicator)[0].legend_group

    var newLayout = {
        title: {
            text: indicator
        },
        grid: {
            rows: dataSelected.length,
            columns: 1,
            pattern: "independent",
            roworder: "bottom to top"
        }
    }

    if (legend_group.includes('counts')) {
        newLayout.margin = { t: 30, b: 30, l: 50, r: 0 }
        newLayout.yaxis = { zeroline: false }
    }

    if (legend_group.includes('detections')) {

        newLayout.margin = { t: 30, b: 40, l: 100, r: 0 }

        newLayout.yaxis = {
            ticklen: 4,
            tickcolor: 'white',
            range: [-1.5, 1.5],
            tickmode: "array",
            tickvals: [2, 1, 0, -1, -2],
            ticktext: ['', 'Detected', 'Not detected', 'No data', ''],
            zeroline: false,
            fixedrange: true
        }
    }


    let gap = 0.01

    dataSelected.forEach((v, i) => {
        let newY = { ...newLayout.yaxis }
        let domainMin = i / dataSelected.length
        let domainMax = (i + 1) / dataSelected.length - gap
        if (i > 0) {
            domainMin = domainMin + gap
        }
        newY.domain = [domainMin, domainMax]
        let axisInd = i == 0 ? 'yaxis' : 'yaxis' + (i + 1);
        newLayout[axisInd] = newY
    })


    // // get present traces
    let currentTraces = document.getElementById(chartContainerId).data.map((v, i) => i)
    Plotly.deleteTraces(chartContainerId, currentTraces)
    newTraces.forEach(traceArray => Plotly.addTraces(chartContainerId, traceArray))
    Plotly.relayout(chartContainerId, newLayout)
}

export { updateLineChart }

// Function to split array of objects by year of the date value
function splitBy(array, key) {

    const separatedBy = {};

    array.forEach((item) => {
        // Get the year from the date value
        //const year = new Date(item[key]).getFullYear();
        const keyName = item[key]

        // Check if the year already exists as a key in the object
        if (!separatedBy[keyName]) {
            // If the year doesn't exist, create a new array for that year
            separatedBy[keyName] = [item];
        } else {
            // If the year exists, add the item to the corresponding array
            separatedBy[keyName].push(item);
        }
    });

    // Extract the arrays of objects separated by year
    const result = Object.values(separatedBy);
    return result;
}

