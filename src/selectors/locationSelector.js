
/** Initialise location selector ----
 * 
 *  
 */

import { locations } from "../../data/locations.js";
import { selectorDataAndIds } from "../selectorDataAndIds.js"

let locationSelector = document.getElementById(selectorDataAndIds.selectorIds.location)

var $locationSelector = $(locationSelector)
    .selectize({
        plugins: ['remove_button'],
        maxItems: 5,
        valueField: 'location',
        labelField: 'location',
        //onItemRemove: function(){console.log('removed')}
        //options: locations,
        //items: [locations[0].location],
        //dropdownParent: 'body'
    });

function updateLocationSelectorOnChange(callback) {

    $locationSelector.off('change');
    $locationSelector.on('change', function () {

        let selectedItems = $(this)[0].selectize.items
        if (selectedItems.length == 0){
            return
        }
        
        //console.log('updateSiteTypeSelectorOnChange: do something with data')
        callback()
    }
    )

}

function updateLocationSelectorOptions(data){
    let uniqueLocations = [ ...new Set(data.map(row => row.location)) ]
    let top5 = uniqueLocations.filter((v,i)=> i < 5)
    let $locationSelector = $('#location-selector')[0].selectize
    let previousSelected = $locationSelector.items
    previousSelected = previousSelected.length == 0 ? top5 : previousSelected
    $locationSelector.clear(false) // triggers an onchange event if true
    $locationSelector.clearOptions();
    $locationSelector.addOption(uniqueLocations.map(v=>({location: v})))
    $locationSelector.refreshOptions(false)
    $locationSelector.setValue(previousSelected) 
}

export { updateLocationSelectorOnChange, updateLocationSelectorOptions }