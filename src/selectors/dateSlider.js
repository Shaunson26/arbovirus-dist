/** Initialise date slider
* 
*  Start an ion range slider
*
*/

import { selectorDataAndIds } from "../selectorDataAndIds.js"

var $dateSlider =
    $(`#${selectorDataAndIds.selectorIds.date}`)
        .ionRangeSlider({
            type: 'single',
            skin: 'flat'
        });


/** Initialise date slider
* 
*  Set slider attributes given data
*
* @param {Array} data parsed json with elements ...
*/
function updateDateSliderValues(data) {

    let uniqueDates = [...new Set(data.map(e => e.weekendDate))].sort()
    let dateSlider = $dateSlider.data("ionRangeSlider")

    dateSlider.update({
        values: uniqueDates,
        from: uniqueDates.length - 1,
    });

}

function updateDateSliderOnChange(callback) {

    let dateSlider = $dateSlider.data("ionRangeSlider")

    dateSlider.update({
        onChange: callback
    });

}

export { updateDateSliderValues, updateDateSliderOnChange }