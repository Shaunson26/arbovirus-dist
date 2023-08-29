// Initial and constants
import { subsetObject } from "../utils.js"
import { locations } from "../data-configuration-files/locations.js"
import * as selectors from "../selectors/latest-selectors.js"
import { updateValueBoxes } from "../value-boxes/value-boxes.js"
import * as mapViz from "../maps/detection-map.js"
import * as tableViz from "../datatable/latest-datatables.js"

export function initialize() {

    let displaySelector =
        selectors.makeDisplaySelector('ls-display')

    let indicatorSelector =
        selectors.makeIndicatorSelector('ls-indicators')

    var detectionMap = mapViz.initialiseMap('ls-map')

    return {
        displaySelector: displaySelector,
        indicatorSelector: indicatorSelector,
        detectionMap: detectionMap
    }
}

export function updateStuff(data, pageObjects) {

    let indicatorsSelected = $('#ls-indicators')[0].selectize.items

    if (indicatorsSelected.length > 0) {

        selectors.updateCheckboxes.enable('ls')

        let defaultCols = ['location', 'reportWeek', 'season']

        let requireMosCounts = $('#ls-include-counts')[0].checked
        let requireEnvParams = $('#ls-include-environmental-params')[0].checked

        let mosCounts = requireMosCounts ? ["total_mosquito", "culex_annulirostris", "aedes_vigilax"] : [];
        let envParams = requireEnvParams ? ["rain_cumulative", "temperature_max_avg", "temperature_max", "temperature_min_avg", "temperature_min"] : [];

        let keysToSubset =
             [defaultCols, indicatorsSelected, mosCounts, envParams].reduce((a, c) => a.concat(c), [])

        data =
            data
                .map(row => subsetObject(row, keysToSubset))
    } else {

        selectors.updateCheckboxes.disable('ls')


    }


    updateValueBoxes(data, 'ls')
    mapViz.updateMarkers(pageObjects.detectionMap, data, locations)
    tableViz.updateTable('ls-table-container', data)
}

export function updateEventListeners(data, pageObjects, callback) {
    selectors.updateIndicatorSelectorOnChange('#ls-indicators', data, pageObjects, callback)
    selectors.updateTableCheckboxOnChange(['#ls-include-counts', '#ls-include-environmental-params'], data, pageObjects, callback)
}