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
const response = await fetch("./src/data-configuration-files/latest-n-indicator-selector-options.csv");
const indicatorOptionsText = await response.text();
export let indicatorOptions = parseCsvText(indicatorOptionsText)


let optgroups = indicatorOptions.map(row => row.optgroup)
optgroups = [...new Set(optgroups)].map(value => ({ groupName: value }))

/**
 * Selector for display of map or table
 * @param {} id 
 * @returns 
 */
let displayIds = {
    lrw: {
        mapDivId: '#lrw-map',
        tableDivId: '#lrw-table',
        tableDivContainerId: '#lrw-table-container',
    },
    ls: {
        mapDivId: '#ls-map',
        tableDivId: '#ls-table',
        tableDivContainerId: '#ls-table-container',
    }
}

/**
 * Make a selector for display of map or table.
 * @param {String} id id of the <select> element, XXX-display
 * @returns 
 */
export function makeDisplaySelector(id) {

    let idPrefix = id.replace('-display', '')

    const { mapDivId, tableDivId, tableDivContainerId} = displayIds[idPrefix]

    let selectize = $(`#${id}`).selectize({
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
export function makeIndicatorSelector(id) {

    let selectize = $(`#${id}`).selectize({
        placeholder: 'All selected',
        plugins: ['remove_button'],
        maxItems: null,
        valueField: 'value',
        labelField: 'label',
        optgroups: optgroups,
        optgroupLabelField: 'groupName', // refers to the label field in "optgroups"
        optgroupValueField: 'groupName',
        optgroupField: 'optgroup',
        options: indicatorOptions,
        onChange: function () {
            console.log(this.items)
        }

    })

    return selectize
}

export function updateIndicatorSelectorOnChange(id, data, callback) {

    let instance = $(id)[0].selectize

    instance.off('change');

    instance.on('change', function () {
        callback(data)
    })
}

/**
 * Toggle checkboxes, used with datatable.
 */
let checkboxIds = {
    "lrw": ['#lrw-include-counts', '#lrw-include-environmental-params'],
    "ls": ['#ls-include-counts', '#ls-include-environmental-params']
}

export let updateCheckboxes = {
    enable: function (id) {
        checkboxIds[id].forEach(checkboxId => $(checkboxId).attr('disabled', false))
    },
    disable: function (id) {
        checkboxIds[id].forEach(checkboxId => $(checkboxId).attr('disabled', true).prop('checked', true))
    }
}

export function updateTableCheckboxOnChange(ids, data, callback) {

    let checkboxes = ids.map(id => $(id))

    checkboxes.forEach(checkbox => {

        checkbox.off('change');

        checkbox.on('change', function () {

            callback(data)
        })
    })

}




