/** Populate measure selector
 * 
 * Populate measure selectize and create on change function that populates
 * indicator selector options
 */


import { selectorDataAndIds } from "../selectorDataAndIds.js"

let measureSelector = document.getElementById(selectorDataAndIds.selectorIds.measure)

let measureOptions = [...new Set(selectorDataAndIds.indicators.map(v => v.measure_group))];
measureOptions = measureOptions.map(v => ({ measure_group: v }))

var $measureSelector = $(measureSelector).selectize({
    maxItems: 1,
    valueField: "measure_group",
    labelField: "measure_group",
    options: measureOptions,
    items: [measureOptions[0].measure_group],
    onInitialize: function () {
        let measureGroup = this.items[0]
        updateIndicatorSelections(measureGroup)
        updateMeasureText(measureGroup)
    },
    onChange: function(){
        let measureGroup = this.items[0]
        updateIndicatorSelections(measureGroup)
        updateMeasureText(measureGroup)
    }
});

/**
 * Update indicator selector selectize.
 */

function updateIndicatorSelections(measureGroup) {

    // Extract indicator objects with measureGroup value
    let newIndicators = selectorDataAndIds.indicators.filter(v => v.measure_group == measureGroup)
    let indicatorSelector = document.getElementById(selectorDataAndIds.selectorIds.indicator)
    var selectize = indicatorSelector.selectize;

    selectize.clear(false) // triggers an onchange event if true
    selectize.clearOptions();
    selectize.addOption(newIndicators)
    selectize.refreshOptions(false)

    // Done in tabs
    if (measureGroup == "Virus detections") {
       // selectize.setMaxItems(null)
        selectize.setValue(newIndicators.map(v=> v.indicator)) // triggers an onchange event
    }

    if (measureGroup == "Mosquito abundances") {
        //selectize.setMaxItems(1)
        selectize.setValue(newIndicators[0].indicator) // triggers an onchange event
    }

   
}

function updateMeasureText(items) {
    
    var tabs = document.getElementsByClassName("data-text");

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    if (items.includes('abundances')) {
        document.getElementById('mosquito-abundance-text').style.display = "block";
    }
    if (items.includes('detections')) {
        document.getElementById('mosquito-isolates-text').style.display = "block";
    }
}
