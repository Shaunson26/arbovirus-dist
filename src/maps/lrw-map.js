/**
 * Map for latest week
 */

import { lrwSelectorOptions } from "../selectors/lrw-selectors.js";
import { sumIndicatorValues, subsetObject, jsonToTable } from "../utils.js";

let mapContainerId = "lrw-map"

function addCss() {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = 'lrw-map-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './src/maps/lrw-map.css';
    link.media = 'all';
    head.appendChild(link);
}

addCss()

// How would you make this into a function?
export function initialiseMap() {

    let tiles =
        L.tileLayer('https://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
            maxZoom: 8,
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>,' +
                'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
                'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
                'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        })

    const lrwMap =
        L.map(mapContainerId, {
            zoomControl: true,
            minZoom: 4,
            //maxZoom: 8,
            //maxBounds: [[-45, 130], [-15, 165]],
            layers: [tiles]

        });

    // NSW bounds
    //lrwMap.fitBounds([[-40, 139], [-26, 155]])
    lrwMap.setView([-33, 147], 5);
    addLegend(lrwMap)
    return lrwMap
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

/**
 * 
 * @param {*} map 
 * @param {*} data 
 * @param {*} locations 
 */

export function updateMarkers(map, data, locations) {

    let currentDate = data[0].report_date

    clearMarkers(map)

    let dataWithCoords = mergeLocationCoords(data, locations)
    let markers = makeMarkers(dataWithCoords)

    let markersLayer =
        L.featureGroup(markers,
            { attribution: `... on ${currentDate}`, id: 'markers' })

    markersLayer.addTo(map)

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

    let toolTipTableObject =
        lrwSelectorOptions.map((row, i) => {
            let obj = {
                Virus: row.label,
                Result: data[row.value]
            }
            return obj
        }).filter(row => row.Result != null)


    let toolTipTable = jsonToTable(toolTipTableObject, 'map-tooltip-table')


    let element =    
        `<span class='map-tooltip-title'>${data.location}</span></br>` +
        toolTipTable


    return element
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
                sumIndicatorValues(mergedData, lrwSelectorOptions.map(row => row.value))

            let marker = L.circleMarker([mergedData.lat, mergedData.lon])
            let style = markerStyle(indicatorSum)
            marker.setStyle(style)
            marker.bindTooltip(makeTooltip(mergedData))
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