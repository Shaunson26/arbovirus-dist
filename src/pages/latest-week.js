/**
 * Latest week visualisation
 * 
 * - Value boxes for number of detections and sites with detections
 * - Selector for map and table
 * - Selector for detection indicators (mosquito and chicken virus detection)
 */

// Initial and constants
import { subsetObject } from "../utils.js"
import { locations } from "../data-configuration-files/locations.js"
import * as selectors from "../selectors/latest-selectors.js"
import { updateValueBoxes } from "../value-boxes/value-boxes.js"
import * as mapViz from "../maps/detection-map.js"
import * as tableViz from "../datatable/latest-datatables.js"

let $lrwIndicatorSelector =
    selectors.makeIndicatorSelector('lrw-indicators')

let $lrwDisplaySelector =
    selectors.makeDisplaySelector('lrw-display')

var lrwMap = mapViz.initialiseMap('lrw-map')

export function updateStuff(data) {

    let indicatorsSelected = $('#lrw-indicators')[0].selectize.items

    if (indicatorsSelected.length > 0) {

        selectors.updateCheckboxes.enable('lrw')

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

        selectors.updateCheckboxes.disable('lrw')
    }


    updateValueBoxes(data, 'lrw')
    mapViz.updateMarkers(lrwMap, data, locations)
    tableViz.updateTable('lrw-table-container', data)
}

export function updateEventListeners(data, callback) {
    selectors.updateIndicatorSelectorOnChange('#lrw-indicators', data, callback)
    selectors.updateTableCheckboxOnChange(['#lrw-include-counts', '#lrw-include-environmental-params'], data, callback)
}