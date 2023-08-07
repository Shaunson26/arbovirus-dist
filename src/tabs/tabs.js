/** Tabbed navigation module
 * 
 * 
 */

/** Add tab shower
 * 
 * @param {String} containerId 
 */
export function addTabButtonEventListeners(containerId) {

    let btns = document.getElementById(containerId).children

    for (let i = 0; i < btns.length; i++) {
        
        btns[i].addEventListener('click', function () {
            let tabId = this.getAttribute('tab-id')
            showTab(tabId)
            toggleSelectorDisplays(tabId)
            toggleSelectorItems(tabId)
        })
    }
}

/** Tab shower
 * 
 * @param {String} id 
 */
export function showTab(id) {

    var tabs = document.getElementsByClassName("tab");
    var tabButtons = document.getElementById('tab-buttons')
    tabButtons = tabButtons.children

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('nsw-brand-accent')
        if (tabButtons[i].getAttribute('tab-id') == id) {
            tabButtons[i].classList.add('nsw-brand-accent')
        }
    }

    document.getElementById(id).style.display = "block";

    // Plotly tweak for size
    window.dispatchEvent(new Event('resize'));

}



function updateTabButtonClickEventListeners(callback) {
    var selectize = $indicatorSelector[0].selectize;
    selectize.off('change');
    selectize.on('change', function () {
        if (this.items[0] !== undefined) {
            //console.log('indicatorSelector: do something with data')
            callback()
        }
    })
}

/**
 * Control what selectors are shown given the tab displayed
 * @param {} tabId 
 */
function toggleSelectorDisplays(tabId) {

    if (tabId.includes('chart') | tabId.includes('table')) {
        //$('#location-selector').trigger('change')
        //dateHideLocationShow()
    } else {
        //dateShowLocationHide()
    }

    if (tabId.includes('map')) {
        //$('#location-selector').trigger('change')
    }

    if (tabId.includes('table')) {
        //$('#location-selector').trigger('change')
    }

    function dateHideLocationShow() {
        $('#map-date-slider-container-top').parent().slideUp(500, function () {
            $('#location-selector-container').parent().slideDown(500)
        })
    }

    function dateShowLocationHide() {
        $('#location-selector-container').parent().slideUp(500, function () {
            $('#map-date-slider-container-top').parent().slideDown(500)
        })
    }


}

/**
 * Control what items are selected given what tab is displayed
 * @param {*} tabId 
 */

function toggleSelectorItems(tabId) {

    var $measure = $('#measure-selector')[0].selectize
    var $indicator = $('#indicator-selector')[0].selectize
    var $locations = $('#location-selector')[0].selectize

    //console.log(tabId)

    if (tabId == 'map-tab') {

        // console.log("tabs.js - map-tab")

        // //console.log($measure.items[0])

        // if ($measure.items[0].includes('abundances')) {
        //     let selected1 = $indicator.items[0]
        //     $indicator.setMaxItems(1)
        //     $indicator.setValue(selected1)
        // }

        // if ($measure.items[0].includes('detections')) {
        //     let selected1 = $indicator.items
        //     $indicator.setMaxItems(null)
        //     $indicator.setValue(selected1)
        // }

    }

    if (tabId == 'chart-tab-by-location') {
        // console.log("tabs.js - single indicator, multiple locations")
        // let selected1 = $indicator.items[0]
        // $indicator.setMaxItems(1)
        // $indicator.setValue(selected1)
        // $locations.setMaxItems(null)
        // //console.log('tabs.js - ', $locations)
    }

    if (tabId == 'chart-tab-by-indicator') {
        // console.log("tabs.js - multiple indicator, single locations")
        // let selected1 = $locations.items[0]
        // $locations.setMaxItems(1)
        // $locations.setValue(selected1) // trigger change
        // $indicator.setMaxItems(null)
    }

    if (tabId == 'chart-tab-by-indicator-heatmap') {
        //console.log("tabs.js - multiple indicator, single locations")
        // let selected1 = $locations.items[0]
        // $locations.setMaxItems(1)
        // $locations.setValue(selected1) // trigger change
        // $indicator.setMaxItems(null)
    }




}




export function getShownTab() {

    var tabs = document.getElementsByClassName("tab");
    var tabButtons = document.getElementById('tab-buttons')
    tabButtons = tabButtons.children

    var shownTabId;

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].style.display !== 'none') {
            shownTabId = tabs[i].id
        }
    }

    return shownTabId

}