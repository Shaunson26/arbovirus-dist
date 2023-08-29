/**
 * Detection map used for latest-(week)(season)
 * 
 * - Leaflet map with markers, legend and tooltips
 */

import { indicatorOptions } from "../selectors/latest-selectors.js";
import { sumIndicatorValues, jsonToTable, addCss, subsetObject } from "../utils.js";
import { showTab } from "../pages/tab-buttons.js";

addCss('detection-map-css', './src/maps/detection-map.css')

// How would you make this into a function?
export function initialiseMap(mapContainerId) {

    let tiles =
        L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
            maxZoom: 8,
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>,' +
                'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
                'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
                'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        })

    const map =
        L.map(mapContainerId, {
            zoomControl: true,
            minZoom: 4,
            //maxZoom: 8,
            //maxBounds: [[-45, 130], [-15, 165]],
            layers: [tiles]

        });

    // NSW bounds
    //lrwMap.fitBounds([[-40, 139], [-26, 155]])
    map.setView([-33, 147], 5);
    addLegend(map)
    addPrintButton(map, tiles)
    return map
}

/** Marker legend
 * 
 * Creates a leaflet control, bottom right, that displays the current 'value'
 * legend. Needs to be 1) added at the map initialisation and 2) on selection event
 */
function addLegend(map) {

    let markerLegend = L.control({ position: 'bottomright' });

    markerLegend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info map-legend');
        let grades = detectionLegend().counts.map(v => v).reverse()
        let labels = detectionLegend().labels.map(v => v).reverse()
        div.innerHTML = `<div class='marker-legend-title'><b>Number of </br> detections</b></div>`

        for (var i = 0; i < grades.length; i++) {
            let color = getMarkerColor(grades[i])
            let label = labels[i]
            div.innerHTML +=
                `<i style="background: ${color}"></i>${label}<br>`
        }
        return div;

    };

    markerLegend.addTo(map)
}

function addPrintButton(map, tiles) {

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
        hideClasses: ['leaflet-left', 'leaflet-top'],
        sizeModes: [sizeMode500]
    }).addTo(map);
}

/**
 * 
 * @param {*} map 
 * @param {*} data 
 * @param {*} locations 
 */

export function updateMarkers(map, data, locations) {

    // Need to summarise season data

    data = summariseByLocation(data)

    let currentDate = data[0].report_date

    clearMarkers(map)

    let dataWithCoords = mergeLocationCoords(data, locations)
    let markers = makeMarkers(dataWithCoords)

    let markersLayer =
        L.featureGroup(markers,
            { attribution: `... on ${currentDate}`, id: 'markers' })

    markersLayer.addTo(map)

}

function summariseByLocation(data) {

    let locations = [...new Set(data.map(row => row.location))].sort()

    let summarisedLocations = locations.map(location => {

        let locationData = data.filter(row => row.location == location);

        const indicatorKeys = indicatorOptions.map(row => row.value);

        const indicatorSums = locationData.reduce((acc, obj) => {
            indicatorKeys.forEach(key => {
                let value = obj[key]
                if (value != null) {
                    acc[key] = (acc[key] || null) + value;
                }
                
            });
            return acc;
        }, {});

        indicatorSums.location = locationData[0].location;
        indicatorSums.report_date = locationData[0].report_date;
        indicatorSums.season = locationData[0].season;

        return indicatorSums;

    })

    return summarisedLocations
}

/**
 * 
 * @returns Object
 */
function detectionLegend() {

    return {
        counts: [-1, 0, 1, 2],
        colors: ['#999999', '#00CC33', '#FF0000', 'black'],
        labels: ["No data", '0', '1', '>1']
    }
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
function getMarkerColor(d) {

    let detectionLegend1 = detectionLegend()
    let color =
        d > 1 ? detectionLegend1.colors[3] :
            d == 1 ? detectionLegend1.colors[2] :
                d == 0 ? detectionLegend1.colors[1] : detectionLegend1.colors[0]

    return color

}

/** Marker size by value
 * 
 * @param {String} type 
 * @param {Number} d 
 * @returns 
 */
function getMarkerRadius(d) {

    let size =
        d >= 1 ? 10 :
            d == 0 ? 5 : 2;

    return size

}

// Marker styling
function markerStyle(value) {


    let markerStyle = {
        radius: getMarkerRadius(value),
        color: getMarkerColor(value),
        weight: 2,
        dashArray: '',
        fillOpacity: 0.7
    }

    return markerStyle
}

function highlightStyle() {

    let markerStyle = {
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    }

    return markerStyle
}

// Tooltip
function makeTooltip(data) {
    let element =
        `<div>${data.location}</div>` +
        `<div class="w3-tiny">Click for summary</div>`

    return element

}

function makePopup(data) {

    let toolTipTableObject =
        indicatorOptions.map((row, i) => {
            let obj = {
                Virus: row.label,
                Result: data[row.value]
            }
            return obj
        }).filter(row => row.Result != null)


    let toolTipTable = jsonToTable(toolTipTableObject, 'map-tooltip-table')

    let div = document.createElement('div')
    //div.addEventListener('click', goToChart)
    div.innerHTML =
        `<span class='map-tooltip-title'>${data.location}</span>` +
        toolTipTable +
        `<span class='map-tooltip-link w3-button' data-location="${data.location}" data-season="${data.season}">Examine in location explorer ...</span>`

    div.children[2].addEventListener('click', goToLocationExplorer)

    return div
}


function goToLocationExplorer() {
    let location = this.getAttribute('data-location')
    let season = this.getAttribute('data-season') + '.csv'
    season = season.replace(/\//, '_')
    // Probably need to ensure season is correct too
    $('#location-download-season')[0].selectize.setValue(season)
    $('#location-selector')[0].selectize.setValue(location)
    showTab('location-explorer')
}

// Mouse interactions
function mouseover(e) {
    e.target.setStyle(highlightStyle())
    e.target.bringToFront();
}

function mouseout(e, style) {
    e.target.setStyle(style)
}

function makeMarkers(data) {

    let markers =
        data.map(mergedData => {

            let indicatorSum =
                sumIndicatorValues(mergedData, indicatorOptions.map(row => row.value))

            let marker = L.circleMarker([mergedData.lat, mergedData.lon])
            let style = markerStyle(indicatorSum)
            marker.setStyle(style)
            marker.bindTooltip(makeTooltip(mergedData))
            marker.bindPopup(makePopup(mergedData))
            marker.on('popupopen', function (e) {
                marker.closeTooltip()
            });

            marker.on('mouseover', mouseover)
            marker.on('mouseout', function (e) { mouseout(e, style) })


            return marker

        })

    return markers

}
function mergeLocationCoords(data, locations) {

    //console.log('locations:', locations, 'data:', data)
    let mergedData =
        data.map(dataRow => {
            let coords =
                locations.filter(
                    locationRow => locationRow.location == dataRow.location)

            let data = {
                ...dataRow,
                ...coords[0]
            }

            return data
        })

    return mergedData


}

function clearMarkers(map) {
    map.eachLayer(layer => {
        if (layer.options.id == 'markers') {
            map.removeLayer(layer)
        }
    })
}