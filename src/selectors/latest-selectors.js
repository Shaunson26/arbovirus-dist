/**
 * Selector functions for latest-(week)(season)
 * 
 * - Uses a CSV of selector options, generated from R workflow
 * - Display selector with object of Ids
 * - Indicator selector with object of indicator metadata
 */
import { parseCsvText, addCss } from "../utils.js";
import { triggerDataTablePageResize } from "../datatable/latest-datatables.js";

addCss('latest-selectors-css', './src/selectors/latest-selectors.css')

// Fetch options
async function getIndicatorOptions(file) {
    const response = await fetch(file);
    const indicatorOptionsText = await response.text();
    const indicatorOptions = parseCsvText(indicatorOptionsText)
    return indicatorOptions
}

export let indicatorOptions = await getIndicatorOptions('./src/data-configuration-files/latest-n-indicator-selector-options-mosquito.csv')
export let indicatorOptionsMosquito = await getIndicatorOptions('./src/data-configuration-files/latest-n-indicator-selector-options-mosquito.csv')
export let indicatorOptionsChicken = await getIndicatorOptions('./src/data-configuration-files/latest-n-indicator-selector-options-chicken.csv')

/**
 * Make a selector for display of map or table that toggles the display
 * of the associated map and table divs with the same id_suffix
 * 
 * @param {String} id_suffix id suffix of the related elements e.g. lrw-mosquito
 * @returns 
 */
export function makeDisplaySelector(id_suffix) {

    const displaySelectorId = `#${id_suffix}-display`,
        mapDivId = `#${id_suffix}-map`,
        tableDivId = `#${id_suffix}-table`,
        tableDivContainerId = `#${id_suffix}-table-container`

    //console.log(displaySelectorId, mapDivId, tableDivId)

    let selectize = $(displaySelectorId).selectize({
        dropdownParent: 'body',
        onChange: function () {

            let toShow = this.items[0]
            let mapDiv = document.querySelector(mapDivId)
            let tableDiv = document.querySelector(tableDivId)

            if (toShow == 'map') {
                tableDiv.style.display = "none";
                mapDiv.style.display = "block";
                window.dispatchEvent(new Event('resize'));
            }

            if (toShow == 'table') {
                mapDiv.style.display = "none";
                tableDiv.style.display = "block";
                triggerDataTablePageResize(tableDivContainerId)
            }
        }
    });

    return selectize
}

/**
 * Make a selector for indicators
 * @param {String} id 
 * @returns 
 */
export function makeIndicatorSelector(id_suffix) {

    const indicatorSelectorId = `#${id_suffix}-indicators`

    // Wrangle options for selectize
    let options, optgroups;

    if (id_suffix.includes('mosquito')) {
        options = indicatorOptionsMosquito
        optgroups = options.map(row => row.optgroup)
        optgroups = [...new Set(optgroups)].map(value => ({ groupName: value }))
    }

    if (id_suffix.includes('chicken')) {
        options = indicatorOptionsChicken
        optgroups = options.map(row => row.optgroup)
        optgroups = [...new Set(optgroups)].map(value => ({ groupName: value }))
    }

    // Selectize call
    let selectize = $(indicatorSelectorId).selectize({
        placeholder: 'All selected',
        plugins: ['remove_button'],
        maxItems: null,
        valueField: 'value',
        labelField: 'label',
        optgroups: optgroups,
        optgroupLabelField: 'groupName', // refers to the label field in "optgroups"
        optgroupValueField: 'groupName',
        optgroupField: 'optgroup',
        options: options,
        onChange: function () {
            console.log(this.items)
        }

    })

    return selectize
}

/**
 * Update the callback of a selector. The callback is updateStuff with given params.
 * The indicators can change over the selection of the data .. hence this is needed.
 * 
 * Can this be fixed to only include id, data and callback
 * 
 * @param {*} id 
 * @param {*} data 
 * @param {*} pageObjects 
 * @param {*} callback 
 */
export function updateIndicatorSelectorOnChange(id_suffix, data, pageObjects, callback) {

    const selectorId = `#${id_suffix}-indicators`

    let instance = $(selectorId)[0].selectize

    instance.off('change');

    instance.on('change', function () {
        callback(data, pageObjects)
    })
}

/**
 * Toggle checkboxes, used with datatable.
 */
export function updateCheckboxes(id_suffix, todo) {

    let checkboxIds = [
        `#${id_suffix}-include-counts`,
        `#${id_suffix}-include-environmental-params`
    ]

    //console.log(checkboxIds)

    if (todo == 'enable') {
        checkboxIds.forEach(checkboxId => $(checkboxId).attr('disabled', false))
    }

    if (todo === 'disable') {

        checkboxIds.forEach(checkboxId => $(checkboxId).attr('disabled', true).prop('checked', true))
    }
}

export function updateTableCheckboxOnChange(id_suffix, data, pageObjects, callback) {

    let checkboxes = [
        $(`#${id_suffix}-include-counts`),
        $(`#${id_suffix}-include-environmental-params`)
    ]

    checkboxes.forEach(checkbox => {

        checkbox.off('change');

        checkbox.on('change', function () {
            console.log('clicked')
            callback(data, pageObjects)
        })
    })

}




