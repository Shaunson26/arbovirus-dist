/**
 * Arbovirus chart visualisation
 * 
 * Indicator by locations. Allow multiple locations to be selected for a given
 * indicator
 * 
 */

import { selectorDataAndIds } from "../selectorDataAndIds.js"

let chartContainerId = 'chart-container-by-indicator'

let layoutDefault = {
    title: "chart-container-by-indicator",
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
export function updateLineChart(data, config) {

    // Get date and value to show ----
    let year = config.year
    let indicator = config.indicator
    let locationsSelected = config.location[0]

    // Update visualisation
    let dataSelected =
        data
            .filter(row => locationsSelected.includes(row.location))

    // iterate of newTrace for subplots
    let newTraces =
        indicator.map((indicator1, i) => {

            //let d = dataSelected.map(v => { let d = new Date(v.weekendDate); return new Date(d.setDate(d.getDate() + i)) })

            let trace = {
                x: dataSelected.map(v => new Date(v.weekendDate)),
                y: dataSelected.map(v => v[indicator1]),
                name: indicator1,
                type: 'scatter',
                mode: 'markers+lines',
                line: {
                    shape: 'vh',
                    width: 1
                }
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
        selectorDataAndIds.indicators.filter(v => v.indicator == indicator[0])[0].legend_group

    let nSubplots = newTraces.length

    let xRange = dataSelected.map(v => v.weekendDate).sort()
    xRange = [xRange[0], xRange[xRange.length - 1]]
    xRange = xRange.map(v => new Date(v).getTime())

    var newLayout = {
        title: {
            text: locationsSelected
        },
        grid: {
            rows: nSubplots,
            columns: 1,
            pattern: "coupled",
            roworder: 'bottom to top'

        },
        xaxis: {
            range: xRange
        }
    }

    if (legend_group.includes('counts')) {
        newLayout.margin = { t: 30, b: 30, l: 50, r: 0 }
        newLayout.yaxis = { zeroline: false }
    }

    if (legend_group.includes('detections')) {

        newLayout.margin = { t: 30, b: 30, l: 90, r: 0 }

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
    nSubplots = nSubplots
    newTraces.forEach((v, i) => {
        let newY = { ...newLayout.yaxis }
        let domainMin = i / nSubplots
        let domainMax = (i + 1) / nSubplots - gap
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



    //dataSelected.map(row => {

    // row.forEach((v, i) => {
    //     let date = new Date(v.weekendDate)
    //     let year = date.getFullYear()
    //     let month = date.getMonth() + 1
    //     let season = month < 6 ? 'end' : 'start'
    //     let dayOfSeason = (date - new Date(`${year}-01-01`)) / (1000 * 3600 * 24)
    //     //dayOfSeason = season == 'end' ? dayOfSeason + 182 : dayOfSeason - 182

    //     month = season == 'end' ? month + 6 : month - 6

    //     season =
    //         season == 'end' ? year + '/' + (year + 1) :
    //             (year - 1) + '/' + year

    //     row[i].dayOfSeason = dayOfSeason
    //     row[i].season = season
    //     row[i].year
    // })


    // let rowSeason = splitBy(row, 'year')

    // let output = []

    // rowSeason.forEach(v => {
    //     //console.log(v)
    //     output.push(makeTrace(v))
    // })

    // return output;

    // function makeTrace(row) {

    //     let output = [];

    //     indicator.forEach(indicator1 => {

    //         let trace = {
    //             //x: yearRow.map(v => v.weekendDate),
    //             x: row.map(v => v.dayOfSeason),
    //             y: row.map(v => v[indicator1]),
    //             //name: row[0].location,
    //             name: row[0].season,
    //             type: 'scatter',
    //             line: { shape: 'vh' },
    //             hovermode: 'x'
    //         }

    //         output.push(trace)
    //     })

    //     return output[0]
    // }


    //})
}

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