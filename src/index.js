// Initial and constants
import * as tabs from "./tabs/tabs.js"
import * as selectors from './selectors/selectors.js'
import { fetchDataAndDo } from "./fetchDataAndDo.js"
import { selectorDataAndIds } from "./selectorDataAndIds.js"
import * as mapViz from "./map/leaflet-map.js"
import * as chartViz from "./chart/plotly-chart.js"
import * as tableViz from "./table/data-table.js"

tabs.addTabButtonEventListeners('tab-buttons')

//tabs.showTab('chart-tab-by-location')
//tabs.showTab('chart-tab-by-indicator')
//tabs.showTab('chart-tab-by-indicator-heatmap')

// Initial load
$(function () {
    fetchDataAndDo(function (data) {
        selectors.updateLocationSelectorOptions(data)
        $('button[tab-id="map-tab"').trigger('click')
        updateEventListeners(data, () => updateThis(data))
        updateThis(data)
    })
})

// year selector is special as it downloads data
selectors.updateYearSelectorOnChange(() => {
    fetchDataAndDo(function (data) {
        //selectors.updateLocationSelectorOptions(data)
        updateEventListeners(data, () => updateThis(data))
        updateThis(data)
    })
})

function updateThis(data) {

    //console.log('updating viz')

    let year = document.getElementById(selectorDataAndIds.selectorIds.year).value.replace(/-.*/i, '')
    let indicatorSelector = $("#indicator-selector")[0].selectize
    let siteTypeSelector = document.querySelector('#site-type-selector')
    let dateSlider = $(`#map-date-slider`).data("ionRangeSlider")
    let locationSelector = $("#location-selector")[0].selectize

    //console.log('  updateThis:', year, indicatorSelector.items, siteTypeSelector.value, dateSlider.result.from_value)

    let config = {
        year: year,
        indicator: indicatorSelector.items,
        siteType: siteTypeSelector.value,
        date: dateSlider.result.from_value,
        location: locationSelector.items
    }

    let shownTab = tabs.getShownTab()

    //if (shownTab == 'map-tab'){
    //console.log('updatethis - map')
    mapViz.updateMarkers(data, config)
    //}

    //if (shownTab == 'chart-tab-by-location'){
    //  console.log('chart-tab-by-location')
    chartViz.updateLineChartByLocations(data, config)
    //}

    //if (shownTab == 'chart-tab-by-indicator'){
    chartViz.updateLineChartInLocation(data, config)
    //}

    //if (shownTab == 'chart-tab-by-indicator-heatmap'){
    chartViz.updateLineChartInLocationHeatmap(data, config)
    //}

    //if (shownTab == 'table-tab'){
    tableViz.updateDataTable(data, config)
    //}       

}



function updateEventListeners(data, callback) {
    selectors.updateDateSliderValues(data)
    selectors.updateDateSliderOnChange(callback)
    selectors.updateIndicatorSelectorOnChange(callback)
    selectors.updateSiteTypeSelectorOnChange(callback)
    selectors.updateLocationSelectorOnChange(callback)
}






