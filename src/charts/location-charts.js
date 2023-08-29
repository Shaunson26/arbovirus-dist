import { indicatorOptions } from "../selectors/latest-selectors.js";
import { subsetObject, uniqueArray } from "../utils.js";

Chart.defaults.font.size = 8;

export function initialiseChart(id, options = {}) {

    options.maintainAspectRatio = false
    options.datasets = { line: { borderWidth: 1, pointRadius: 1, pointHoverRadius: 5 } }

    let chart =
        new Chart(
            document.getElementById(id),
            {
                type: 'line',
                options: options
            }
        );

    return chart
}

export function initialiseChartMatrix(id) {
    const chart = new Chart(id, {
        type: 'matrix',
        data: {
            datasets: [],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                         afterTitle(context) {
                             return context[0].formattedValue
                         },
                        label(context) {
                            const row = context.dataset.data[context.dataIndex];
                            const vLabel =
                                row.v == 1 ? 'Detected' :
                                    row.v == 0 ? 'Not detected' :
                                        'Not collected'
                            return [vLabel];

                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    ticks: {
                        display: true,
                        minRotation: 0
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'category',
                    offset: true,
                    ticks: {
                        display: true,
                        autoSkip: false
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}



export function updateChartMatrix(data) {

    let locationSelected = $('#location-selector')[0].selectize.items

    if (locationSelected.length == 0) {
        return
    }

    data = data.filter(row => row.location == locationSelected[0])

    let report_dates = uniqueArray(data, 'report_date')
    let indicators = indicatorOptions.map(row => row.value)
    // x = report_date, y = indicator, v = detection
    let matrixData = []

    report_dates.forEach(date => {
        let dateData = data.filter(row => row.report_date == date)[0]  

        indicators.forEach(indicator => {
            let dataRow = { x: date, y: indicator, v: dateData[indicator] }
            matrixData.push(dataRow)
        })
    })



    let detectionColors = ['#999999', '#00CC33', '#FF0000', 'black']
    //console.log(matrixData[0])
    //console.log(matrixData.filter(row=> row.x == '2021-03-20'))

    let chart = Chart.getChart('detections-matrix')
    chart.options.scales.x.labels = report_dates
    chart.options.scales.y.labels = indicators
    chart.data.datasets = [{
        data: matrixData,
        width: ({ chart }) => (chart.chartArea || {}).width / report_dates.length - 1,
        height: ({ chart }) => (chart.chartArea || {}).height / indicators.length - 1,
        borderWidth: 0,
        backgroundColor(context) {
            const value = context.dataset.data[context.dataIndex].v;            
            return value == 1 ? detectionColors[2] :
                value == 0 ? detectionColors[1] :
                    detectionColors[0]
        }
    }]
    chart.options.plugins.too

    chart.update()

}

export function updateChart(data) {

    let locationSelected = $('#location-selector')[0].selectize.items

    if (locationSelected.length == 0) {
        return
    }

    data = data.filter(row => row.location == locationSelected[0])

    //console.log(data[0])

    // detections
    let detectionKeys = Object.keys(data[0]).filter(key => key.startsWith('mos') | key.startsWith('sc'))
    detectionKeys = detectionKeys.filter(item => item !== 'sc_num_pos' && item !== 'sc_num_tested')

    let summedDetections =
        data.map(row => {
            let detectionData = subsetObject(row, detectionKeys)
            const sumValues = Object.values(detectionData).reduce((a, b) => a + b, 0);
            return sumValues
        })



    let chart = Chart.getChart('detections')

    chart.data = {
        labels: data.map(row => row.report_date),
        datasets: [{
            data: summedDetections,
            borderColor: '#002664'
        }]
    }

    chart.update()

    // Abundances
    let countKeys = ['total_mosquito', 'aedes_vigilax', 'culex_annulirostris']
    let countColors = ['#002664', '#146cfd', '#f3631b']

    let countsDatasets =
        countKeys
            .map(key => data.map(row => row[key]))
            .map((data, i) => (
                {
                    label: countKeys[i],
                    data: data,
                    backgroundColor: setOpacity(countColors[i], 0.5),
                    borderColor: countColors[i]
                }
            ))

    chart = Chart.getChart('abundances')

    chart.data = {
        labels: data.map(row => row.report_date),
        datasets: countsDatasets
    }

    chart.update()

    // Rain      
    chart = Chart.getChart('rain')

    chart.data = {
        labels: data.map(row => row.report_date),
        datasets: [{
            data: data.map(row => row['rain_cumulative']),
            borderColor: '#002664'
        }]
    }

    chart.update()

    // Temperature
    let temperatureKeys = ["temperature_min", "temperature_min_avg", "temperature_max_avg", "temperature_max"]
    let temperatureLabels = ["Min", "Min (avg)", "Max (avg)", "Max"]
    let temperatureColors = ['#002664', '#146cfd', '#f3631b', '#941b00']
    let temperatureDatasets =
        temperatureKeys
            .map(key => data.map(row => row[key]))
            .map((data, i) => (
                {
                    label: temperatureLabels[i],
                    data: data,
                    backgroundColor: setOpacity(temperatureColors[i], 0.5),
                    borderColor: temperatureColors[i]
                }
            ))

    chart = Chart.getChart('temperature')

    chart.data = {
        labels: data.map(row => row.report_date),
        datasets: temperatureDatasets
    }

    chart.update()

    //chart.something
    //chart.update()

}

const setOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;