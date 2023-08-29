import { locations } from "../data-configuration-files/locations.js";
import { downloadSeasonOptions } from "../data-configuration-files/season-download-selector-options.js";
import { fetchData } from "../utils.js";
import * as chartViz from '../charts/location-charts.js'

let seasonSelector = $('#location-download-season').selectize({
    maxItems: 1,
    valueField: 'value',
    labelField: 'label',
    options: downloadSeasonOptions,
    items: [downloadSeasonOptions[0].value],
    onChange: function () {

        let seasonsToDownload = this.items.map(file => `./data/${file}`)
        var modal = document.getElementById('download-modal')

        modal.style.display = 'block'

        fetchData(seasonsToDownload, function (data) {
            updateEventListeners(data, updateStuff)
            updateStuff(data)
            modal.style.display = 'none'
        })
    }
})

let locationSelector = $('#location-selector').selectize({
    maxItems: 1,
    valueField: 'location',
    labelField: 'location',
    // optgroups: optgroups,
    // optgroupLabelField: 'groupName', // refers to the label field in "optgroups"
    // optgroupValueField: 'groupName',
    // optgroupField: 'optgroup',
    sortField: 'location',
    options: locations,
    items: ['Port Macquarie'],
    onChange: function () {
        //console.log(this.items)
        // update with data
    }

})

chartViz.initialiseChartMatrix('detections-matrix')

chartViz.initialiseChart('detections',
    {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 2,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: { legend: { display: false } }
    })

chartViz.initialiseChart('abundances', { interaction: { mode: 'index', intersect: false }, plugins: { legend: { align: 'end' } } })
chartViz.initialiseChart('rain', { scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } })
chartViz.initialiseChart('temperature', { interaction: { mode: 'index', intersect: false }, plugins: { legend: { align: 'end' } } })


export function updateStuff(data) {

    chartViz.updateChart(data)
    chartViz.updateChartMatrix(data)
}

function updateLocationSelectorItems(id, data) {

    let uniqueLocations = [...new Set(data.map(row => row.location))]
    let locationSelector = $(id)[0].selectize
    let previousSelected = locationSelector.items[0]
    let previousNotInNew = !uniqueLocations.includes(previousSelected)
    let setValue = previousNotInNew ? uniqueLocations[0] : previousSelected

    locationSelector.clear(false) // triggers an onchange event if true
    locationSelector.clearOptions();
    locationSelector.addOption(uniqueLocations.map(v => ({ location: v })))
    locationSelector.refreshOptions(false)
    locationSelector.setValue(setValue)

}

function updateLocationSelectorOnChange(id, data, callback) {

    let instance = $(id)[0].selectize

    instance.off('change');

    instance.on('change', function () {
        callback(data)
    })
}

export function updateEventListeners(data, callback) {
    updateLocationSelectorItems('#location-selector', data)
    updateLocationSelectorOnChange('#location-selector', data, callback)
}


