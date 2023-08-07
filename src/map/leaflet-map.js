/**
 * Arbovirus map visualisation
 * 
 */

// import "../../node_modules/leaflet/dist/leaflet.css"
// import { } from "leaflet";
// import { } from 'leaflet-easyprint';
// import "./leaflet-map.css"
//import zoomIcon from "../images/zoom_out.svg"
import { selectorDataAndIds } from "../selectorDataAndIds.js"
import { locations } from "../../data/locations.js"; // location metadata array
import { jsonToTable } from "../table/data-table.js"; // table creator

//import { indictorTypes, selectionIds } from "../selectors/selectors.js" // names of visualisation variables

let mapContainerId = "map-container"

let tiles =
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

let map =
    L.map(mapContainerId, {
        zoomControl: true,
        minZoom: 4,
        //maxZoom: 8,
        //maxBounds: [[-45, 130], [-15, 165]],
        layers: [tiles]

    });

// NSW bounds
map.fitBounds([[-40, 139], [-26, 155]])
//map.setView([-33.285, 146.997], 4)


/** Update leaflet markers
 * 
 * Obtain values from input and update markers.
 * 
 * @param {*} data  
 */
export function updateMarkers(data, config) {

    // Get date and value to show ----
    let year = config.year
    let indicator = config.indicator
    let date = config.date
    let siteType = config.siteType

    // Update markers ----
    // Map cleaning
    map.eachLayer(layer => {
        if (layer.options.id == 'markers') {
            map.removeLayer(layer)
        }
    })

    // Filtered data
    // JSON of only selected dates and siteType locations
    // data = data.currentTarget.data;
    let dataSelected = data.filter(v => v.weekendDate == date)

    if (siteType !== 'All') {
        let siteTypeLocations = locations.filter(v => v.siteType == siteType).map(v => v.location)
        dataSelected = dataSelected.filter(v => siteTypeLocations.includes(v.location))
    }

    //console.log('update markers')

    let legend_group = selectorDataAndIds.indicators.filter(v => v.indicator == indicator[0])[0].legend_group

    // Markers
    // Map data location to location coordinate
    // circleMarkers with tooltip and popup
    // Popup should show det
    let markers =
        dataSelected.map(v => {    

            v.sum = sumIndicatorValues(v, indicator)       
    
            let coords = locations.filter(v2 => v2.location == v.location)[0]       

            let markerStyle = {
                radius: getMarkerRadius(v.sum),
                color: getMarkerColor(v.sum, legend_group),
                weight: 2,
                dashArray: '',
                fillOpacity: 0.7
            }

            let highlightStyle = {
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            }

            let tooltipElements =  `${v.location}</br><span class="w3-tiny">Click for weekly summary</span`

            let popupData = getPopupData(data, v.location, indicator)
            let popupTable = jsonToTable(popupData, 'popup-table')
            let popupElements = createPopupElements(v.location, popupTable)

            // Object generation
            let marker =
                L.circleMarker(
                    [coords.lat, coords.lon],
                    markerStyle)

            marker.bindTooltip(tooltipElements)

            marker.bindPopup(popupElements)


            marker.on('click', function (e) {
                this.closeTooltip();
            })

            marker.on('mouseover', function (e) {
                e.target.setStyle(highlightStyle)
                e.target.bringToFront();
                // Fix interpretability 
                markerInfoBox.update(v, indicator)
            })

            marker.on('mouseout', function (e) {
                e.target.setStyle(markerStyle)
                markerInfoBox.update()
            })

            // return

            return marker
        })

    // id = 'markers' used to remove all markers
    let markersLayer =
        L.featureGroup(markers, { attribution: `${indicator} on ${date}`, id: 'markers' })

    markersLayer.addTo(map)
    markerLegend.update(indicator)

    setTimeout(function () { map.flyToBounds(markersLayer.getBounds()) }, 250)

    //container.setAttribute('data-showing', showingValue)
}

/**
 * 
 * @param {*} data 
 * @param {*} indicators 
 * @returns 
 */
function sumIndicatorValues(data, indicators){
                
    let sum = null;

    for (const indicator1 of indicators) {
        if (data.hasOwnProperty(indicator1)) {
            let value = data[indicator1]
            if (value > -1) {
                sum += value;
            }
        }

    }

    sum = sum == null ? -1 : sum

    return sum
}

/**
 * Action for button in popup
 * @param {String} locationSelected 
 */
function goToChart(locationSelected) {
    $('#location-selector')[0].selectize.setValue(locationSelected)
    $("button[tab-id='chart-tab-by-indicator']").trigger('click')
}

function createPopupElements(location, table) {
    let div = document.createElement('div')
    //div.addEventListener('click', goToChart)
    div.innerHTML = `<h5>${location}</h5>` +
        `<div style="margin-bottom: 8px;">Last 10 reporting weeks</div>` +
        table +
        `<div style="margin-top: 8px;"><a class="w3-button nsw-brand-accent-hover">See graph</a></div>`

    div.children[3].children[0].addEventListener('click', () => goToChart(location))

    return div
}

/**
 * Return an object of the data filtered by location, keys and the last 10 rows
 * 
 * @param {Array} data 
 * @param {*} location 
 * @param {*} indicators 
 * @returns 
 */
function getPopupData(data, location, indicators) {
    let dataLocation = data.filter(dataItem => dataItem.location == location)
    let tableKeys = ['weekendDate']
    indicators.map(indicator => tableKeys.push(indicator))
    let tableData = dataLocation.map(dataItem => selectKeysFromObject(dataItem, tableKeys))
    tableData = tableData.slice(0, 9)
    tableData.forEach((row, i) => {
        for (let indicator of indicators) {
            if (row[indicator] == -1) {
                tableData[i][indicator] = 'n.c'
            }
        }

    })
    //console.log(tableData)
    return tableData
}

/**
 * 
 * const myObject = {
 * name: "John",
 * age: 30,
 * gender: "male",
 * city: "New York",
 * };
 * 
 * const selectedKeys = ["name", "age", "city"];
 * const selectedValues = selectKeysFromObject(myObject, selectedKeys);
 * 
 * console.log(selectedValues);
 * 
 * {
 *  name: "John",
 * age: 30,
 * city: "New York",
 * }
 *  
 * @param {*} keysToSelect 
 * @returns 
 */

function selectKeysFromObject(obj, keysToSelect) {
    // Initialize an empty object to store the selected keys and values
    const selectedObj = {};

    // Loop through the keys in the keysToSelect array
    for (const key of keysToSelect) {
        // Check if the key exists in the original object
        if (obj.hasOwnProperty(key)) {
            // Copy the key-value pair to the selected object
            selectedObj[key] = obj[key];
        }
    }

    return selectedObj;
}


/**
 * Count legend thresholds and colours
 */
let countLegend = {
    counts: [-1, 0, 50, 101, 1001, 10000],
    colors: ['#999999', '#00CC33', '#FFFF00', '#FF9900', '#FF0000', '#330066'],
    labels: ["No collection", "Low (<50)", "Medium (50-100)", "High (101-1,000)", "Very high (1,001-10,000)", "Extreme (>10,000)"]
}

let detectionLegend = {
    counts: [-1, 0, 1, 2],
    colors: ['#999999', '#00CC33', '#FF0000', 'black'],
    labels: ["No collection", '0', '1', '>1']
}

/** Marker size by value
 * 
 * @param {String} type 
 * @param {Number} d 
 * @returns 
 */
function getMarkerRadius(d) {

    return d >= 0 ? 5 : 2;

}

/** Marker colouring
 * 
 * Colour scale given value type
 * 
 * @param {Number} d data value
 * @param {String} legend_group colour function to return
 * 
 * @returns colour value
 */
function getMarkerColor(d, legend_group) {

    function countColors(d) {
        return d >= 10000 ? countLegend.colors[5] :
            d >= 1001 ? countLegend.colors[4] :
                d >= 101 ? countLegend.colors[3] :
                    d >= 50 ? countLegend.colors[2] :
                        d >= 0 ? countLegend.colors[1] : countLegend.colors[0]
    }

    function detectionColors(d) {
        return d > 1 ? detectionLegend.colors[3] :
            d == 1 ? detectionLegend.colors[2] :
                d == 0 ? detectionLegend.colors[1] : detectionLegend.colors[0]
    }

    if (legend_group.includes('counts')) {
        return countColors(d)
    }

    if (legend_group.includes('detections')) {
        return detectionColors(d)
    }
}

/** Marker information box
 * 
 * Creates a leaflet control, top right, that displays the currently
 * highlighted circleMarker. Needs to be 1) added at the map initialisation
 * and 2) on marker events
 * 
 */
let markerInfoBox = L.control();

markerInfoBox.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'control-div marker-info');
    this.update();
    return this._div;
};

/** Update info box with passed properties
 * 
 * @param {Array} data 
 * @param {String} type 
 * @param {String} value 
 */
markerInfoBox.update = function (data, indicator) {

    let text = 'Hover over a location'

    if (data) {

        let selectedValues = selectKeysFromObject(data, indicator)
        text = `<b>${data.location}</b></br>`

        for (const key in selectedValues) {
            if (selectedValues.hasOwnProperty(key)) {
                let value = selectedValues[key] == -1 ? 'n.c' : selectedValues[key]
                let keyElement = `<div><span>${key}: </span><span>${value}</span></div>`
                text += keyElement
            }
        }
    }


    this._div.innerHTML = text;
};

markerInfoBox.addTo(map);

/** Marker legend
 * 
 * Creates a leaflet control, bottom right, that displays the current 'value'
 * legend. Needs to be 1) added at the map initialisation and 2) on selection event
 */
let markerLegend = L.control({ position: 'bottomright' });

markerLegend.onAdd = function () {

    this._div = L.DomUtil.create('div', 'control-div marker-legend');
    return this._div;

};

markerLegend.update = function (indicator) {

    this._div.innerHTML = '';
    let grades, labels;

    let indicatorMetadata = selectorDataAndIds.indicators.filter(v => v.indicator == indicator[0])[0]
    let legend_group = indicatorMetadata.legend_group

    if (legend_group.includes('counts')) {
        grades = countLegend.counts.map(v=>v).reverse()
        labels = countLegend.labels.map(v=>v).reverse()
        this._div.innerHTML = `<div class='marker-legend-title'><b>Counts</b></div>`
    }

    if (legend_group.includes('detections')) {
        grades = detectionLegend.counts.map(v=>v).reverse()
        labels = detectionLegend.labels.map(v=>v).reverse()
        this._div.innerHTML = `<div class='marker-legend-title'><b>Number of </br> detections</b></div>`
    }

    for (var i = 0; i < grades.length; i++) {
        let color = getMarkerColor(grades[i], legend_group)
        let label = labels[i]
        this._div.innerHTML +=
            `<i style="background: ${color}"></i>${label}<br>`
    }


};

markerLegend.addTo(map)

/** Marker information box
 * 
 * Creates a leaflet control, top right, that displays the currently
 * highlighted circleMarker. Needs to be 1) added at the map initialisation
 * and 2) on marker events
 * 
 */
let zoomControlBox = L.control({ position: 'topleft' });

zoomControlBox.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'control-div zoom-control');
    this._div.title = "Zoom out to fit markers"
    //this._div.innerHTML = `<i class="material-icons">zoom_out_map</i>`
    this._div.innerHTML = `<img src = "./src/images/zoom_out.svg" alt="Zoom out icon"/>`

    this._div.addEventListener('click', function () {
        map.eachLayer(layer => {
            if (layer.options.id == 'markers') {
                map.flyToBounds(layer.getBounds());
            }
        })
        //
    })
    return this._div;
};

zoomControlBox.addTo(map)

/**
 * 
 */
var sizeMode500 = {
    name: 'Export to PNG',
    width: 800,
    height: 500,
    className: 'print-class'
}

L.easyPrint({
    title: 'Export map',
    exportOnly: true,
    position: 'topleft',
    tileLayer: tiles,
    tileWait: 1000,
    hideControlContainer: false,
    hideClasses: ['marker-info', 'leaflet-left'],
    sizeModes: [sizeMode500]
}).addTo(map);






/** Add event listeners associated with markers
 * 
 * Dropdowns for indicator and site type. Slider for week-ending date.
 * 
 * @param {Array} data json data
 */
export function addMarkerEventListener(data) {

    console.log('map event listeners')

    let indicatorSelector = document.getElementById(selectionIds.indicator)
    let siteTypeSelector = document.getElementById(selectionIds.siteType)
    let dateSlider = $(`#${selectionIds.date}`).data("ionRangeSlider")

    indicatorSelector.addEventListener('change', function () {
        updateMarkers(data)
        markerLegend.update(this.value)
    })

    siteTypeSelector.addEventListener('change', () => {
        updateMarkers(data)
    })

    dateSlider.options.onChange = function (dd) {
        updateMarkers(data)
    }

}
