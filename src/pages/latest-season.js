// Initial and constants
import { subsetObject } from "../utils.js"
import { locations } from "../data-configuration-files/locations.js"
import * as selectors from "../selectors/latest-selectors.js"
import { updateValueBoxes } from "../value-boxes/value-boxes.js"
import * as mapViz from "../maps/detection-map.js"
import * as tableViz from "../datatable/latest-datatables.js"

let $lsIndicatorSelector =
    selectors.makeIndicatorSelector('ls-indicators')

let $lsDisplaySelector =
    selectors.makeDisplaySelector('ls-display')

var lsMap = mapViz.initialiseMap('ls-map')

export function updateStuff(data) {

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
    mapViz.updateMarkers(lsMap, data, locations)
    tableViz.updateTable('ls-table-container', data)
}

export function updateEventListeners(data, callback) {
    selectors.updateIndicatorSelectorOnChange('#ls-indicators', data, callback)
    selectors.updateTableCheckboxOnChange(['#ls-include-counts', '#ls-include-environmental-params'], data, callback)
}