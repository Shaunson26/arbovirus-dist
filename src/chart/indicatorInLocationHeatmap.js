import { selectorDataAndIds } from "../selectorDataAndIds.js"

let chartContainerId = 'chart-container-by-indicator-heatmap'

var chart = new ApexCharts(document.querySelector(`#${chartContainerId}`), {
    series: [],
    chart: {
        height: 200,
        type: "heatmap"
    },
    plotOptions: {
        heatmap: {
            colorScale: {
                ranges: [{
                    from: -2,
                    to: -1,
                    color: '#999999',
                    name: 'Not collected',
                },
                {
                    from: 0,
                    to: 1,
                    color: '#00CC33',
                    name: 'Not detected',
                },
                {
                    from: 1,
                    to: 2,
                    color: '#FF0000',
                    name: 'Detected',
                }
                ]
            }
        }
    },
    legend: {
        showForSingleSeries: true
    }

});

chart.render();


/** Update line chart with new data
 * 
 * @param {Array} data 
 * @returns Nothing, will exit early if no update requird
 */
export function updateLineChart(data, config) {

    // const plotElement = document.getElementById(chartContainerId);
    // const plotHeight = plotElement.clientHeight;
    // const plotWidth = plotElement.clientWidth;
    // console.log('Plot height:', plotHeight, 'Plot width:', plotWidth);

    // Get date and value to show ----
    let year = config.year
    let indicator = config.indicator
    let locationsSelected = config.location[0]

    // Update visualisation
    let dataSelected =
        data
            .filter(row => locationsSelected.includes(row.location))

    let dataSeries =
        indicator.map(indicator1 => {
            let trace = {
                name: indicator1,
                data: dataSelected.map(v => (
                    {
                        x: v.weekendDate,
                        y: v[indicator1]
                    }
                ))
            }
            return trace
        })

    chart.updateSeries(dataSeries)
    chart.updateOptions({
        chart: {
            height: 170 + 50 * (indicator.length - 1)
        }
    })



}
