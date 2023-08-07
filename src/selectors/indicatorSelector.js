
/** Populate indicator selector
 * 
 */

import { selectorDataAndIds } from "../selectorDataAndIds.js"

let indicatorSelector = document.getElementById(selectorDataAndIds.selectorIds.indicator)

var $indicatorSelector = $(indicatorSelector).selectize({
    plugins: ['remove_button'],
    maxItems: null,
    valueField: "indicator",
    labelField: "indicator"
});

function updateIndicatorSelectorOnChange(callback) {
    var selectize = $indicatorSelector[0].selectize;
    selectize.off('change');
    selectize.on('change', function () {
        if (this.items[0] !== undefined) {
            //console.log('indicatorSelector: do something with data')
            callback()
        }
    })
}

export { updateIndicatorSelectorOnChange }
