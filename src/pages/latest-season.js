/**
 * Latest season visualisation
 * 
 * - Value boxes for number of detections and sites with detections
 * - Selector for map and table
 * - Selector for virus
 * - Map and table displays
 * 
 * The selectors, map and table objects need to be passed on for data updating
 * as higher levels of the app.
 * 
 */

// Initial and constants
import { subsetObject } from "../utils.js"
import { locations } from "../data-configuration-files/locations.js"
import * as selectors from "../selectors/latest-selectors.js"
import { updateValueBoxes, updateReportDate } from "../value-boxes/value-boxes.js"
import * as mapViz from "../maps/detection-map.js"
import * as tableViz from "../datatable/latest-datatables.js"

/**
 * Initialise the components on this page and return an object with the
 * component objects required for higher level functions
 * 
 * @returns object
 */
export function initialize() {

    return {
        mosquito: {
            displaySelector: selectors.makeDisplaySelector('ls-mosquito'),
            indicatorSelector: selectors.makeIndicatorSelector('ls-mosquito'),
            detectionMap: mapViz.initialiseMap('ls-mosquito')
        },
        chicken: {
            displaySelector: selectors.makeDisplaySelector('ls-chicken'),
            indicatorSelector: selectors.makeIndicatorSelector('ls-chicken'),
            detectionMap: mapViz.initialiseMap('ls-chicken')
        }
    }
}

/**
 * Update components given new data
 * 
 * @param {} data 
 * @param {*} pageObjects 
 */
export function updateStuff(data, pageObjects) {

    updateReportDate(data, 'ls-date-value')

    // Something todo
    const getDataKeysRequired = function (indicatorSelector) {

        let indicatorsSelected = indicatorSelector.items

        if (indicatorsSelected.length > 0) {

            selectors.updateCheckboxes('ls-mosquito', 'enable')

            //var requireMosCounts = $('#ls-include-counts')[0].checked
            //var requireEnvParams = $('#ls-include-environmental-params')[0].checked
            var requireMosCounts = true
            var requireEnvParams = true

        } else {

            selectors.updateCheckboxes('ls-mosquito', 'disable')
            var requireMosCounts = true
            var requireEnvParams = true
            indicatorsSelected = Object.keys(indicatorSelector.options)

        }

        let defaultCols = ['location', 'reportWeek', 'season']
        let mosCounts = requireMosCounts ? ["total_mosquito", "culex_annulirostris", "aedes_vigilax"] : [];
        let envParams = requireEnvParams ? ["rain_cumulative", "temperature_max_avg", "temperature_max", "temperature_min_avg", "temperature_min"] : [];

        let keysToSubset =
            [defaultCols, indicatorsSelected, mosCounts, envParams].reduce((a, c) => a.concat(c), [])

        return keysToSubset
    }

    // Mosquito
    let mosquitoIndicatorSelector = $('#ls-mosquito-indicators')[0].selectize
    let mosquitoKeysToSubset = getDataKeysRequired(mosquitoIndicatorSelector)

    let mosquitoData =
        data.filter(d => d.location_mosquito == 1).map(row => subsetObject(row, mosquitoKeysToSubset))

    updateValueBoxes(mosquitoData, 'ls-mosquito')
    mapViz.updateMarkers(pageObjects.mosquito.detectionMap, mosquitoData, locations)
    tableViz.updateTable('ls-mosquito', mosquitoData)

    // Chicken
    let chickenIndicatorSelector = $('#ls-chicken-indicators')[0].selectize
    let chickenKeysToSubset = getDataKeysRequired(chickenIndicatorSelector)

    let chickenData =
        data.filter(d => d.location_chicken == 1).map(row => subsetObject(row, chickenKeysToSubset))

    updateValueBoxes(chickenData, 'ls-chicken')
    mapViz.updateMarkers(pageObjects.chicken.detectionMap, chickenData, locations)
    tableViz.updateTable('ls-chicken', chickenData)


}

export function updateEventListeners(data, pageObjects, callback) {
    selectors.updateIndicatorSelectorOnChange('ls-mosquito', data, pageObjects, callback)
    selectors.updateTableCheckboxOnChange('ls-mosquito', data, pageObjects, callback)
    selectors.updateIndicatorSelectorOnChange('ls-chicken', data, pageObjects, callback)
}