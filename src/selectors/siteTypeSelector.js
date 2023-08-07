

/** Initialise the site type selector ----
 * 
 * The column values siteType (All, Coastal, Inland, Sydney). This function works
 * with the location checkbox group. It will disable locations not within the selected
 * siteType
 *  
 */

import { selectorDataAndIds } from "../selectorDataAndIds.js"

let siteTypeSelector = document.getElementById(selectorDataAndIds.selectorIds.siteType)
let siteTypeOptions = selectorDataAndIds.siteTypes.map(value => ({ value: value }))

var $siteTypeSelector = $(siteTypeSelector)
    .selectize({
        valueField: 'value',
        labelField: 'value',
        options: siteTypeOptions,
        items: [siteTypeOptions[0].value],
    });

function updateSiteTypeSelectorOnChange(callback) {
    $siteTypeSelector.off('change');
    $siteTypeSelector.on('change', function () {
        //console.log('updateSiteTypeSelectorOnChange: do something with data')
        callback()
    }
    )
}

export { updateSiteTypeSelectorOnChange }