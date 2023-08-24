// Initial and constants
import { jsonColumnToRows, subsetObject, parseCsvText } from "./utils.js"
import { locations } from "./data-configuration-files/locations.js"
import * as tabs from "./tabs/tabs.js"
import * as selectors from "./selectors/lrw-selectors.js"
import { updateValueBoxes } from "./value-boxes/value-boxes.js"
import * as mapViz from "./maps/lrw-map.js"
import * as tableViz from "./datatable/lrw-datatable.js"

//tabs.showTab('explorer-tab')
//tabs.showTab('chart-tab-by-indicator')
//tabs.showTab('chart-tab-by-indicator-heatmap')

tabs.initialiseTabButtons()
var lrwMap = mapViz.initialiseMap()

// Initial load
$(function () {

    getLatestData(function (data) {
        updateEventListeners(data, updateStuff)
        updateStuff(data)
    })

})

async function getLatestData(callback) {
    const response = await fetch("./data/latest.csv");
    let latestData = await response.text();
    latestData = parseCsvText(latestData)
    callback(latestData)
}

function updateStuff(data) {

    let indicatorsSelected = $('#lrw-indicators')[0].selectize.items

    if (indicatorsSelected.length > 0) {

        $('#lrw-include-counts').attr('disabled', false)
        $('#lrw-include-environmental-params').attr('disabled', false)

        let requireMosCounts = $('#lrw-include-counts')[0].checked
        let requireEnvParams = $('#lrw-include-environmental-params')[0].checked

        let defaultCols = ['location', 'reportWeek', 'season']
        let mosCounts = requireMosCounts ? ["total_mosquito", "culex_annulirostris", "aedes_vigilax"] : [];
        let envParams = requireEnvParams ? ["rain_cumulative", "temperature_max_avg", "temperature_max", "temperature_min_avg", "temperature_min"] : [];

        let keysToSubset =
            [defaultCols, indicatorsSelected, mosCounts, envParams].reduce((a, c) => a.concat(c), [])

        data =
            data
                .map(row => subsetObject(row, keysToSubset))
    } else {

        $('#lrw-include-counts').attr('disabled', true)
        $('#lrw-include-counts').prop('checked', true)
        $('#lrw-include-environmental-params').attr('disabled', true)
        $('#lrw-include-environmental-params').prop('checked', true)
    }


    updateValueBoxes(data)
    mapViz.updateMarkers(lrwMap, data, locations)
    tableViz.updateLrwTable(data)
}

function updateEventListeners(data, callback) {
    selectors.updateLrwIndicatorSelectorOnChange(data, callback)
    selectors.updateLrwTableCheckboxOnChange(data, callback)

}







