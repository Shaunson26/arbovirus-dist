import { sumIndicatorValues } from "../utils.js"
import { indicatorOptionsMosquito, indicatorOptionsChicken } from "../selectors/latest-selectors.js"

export function updateReportDate(data, id) {
    $(`#${id}`).text(data[0].report_date)
}

/**
 * Update value boxes using prefix-suffix matching
 * 
 * @param {Object} data 
 * @param {String} id_suffix 
 */
export function updateValueBoxes(data, id_suffix) {

    let indicatorNames;

    if (id_suffix.includes('mosquito')){
        indicatorNames = indicatorOptionsMosquito.map(row => row.value)
    }

    if (id_suffix.includes('chicken')){
        indicatorNames = indicatorOptionsChicken.map(row => row.value)
    }

    let numberOfDetections = getTotalNumberOfDetections(data, indicatorNames)
    let numberOfLocationsWithDetections = getLocationsWithDetections(data, indicatorNames).length
    let numberOfLocationsWithData = getLocationsWithData(data, indicatorNames).length

    //console.log(numberOfDetections, numberOfLocationsWithDetections, numberOfLocationsWithData)

    $(`#${id_suffix}-detection-value`).text(numberOfDetections)
    $(`#${id_suffix}-location-detections-value`).text(numberOfLocationsWithDetections)
    $(`#${id_suffix}-location-with-data-value`).text(numberOfLocationsWithData)

}

/**
 * 
 * @param {*} data 
 * @param {*} indicatorNames 
 * @returns 
 */

function getTotalNumberOfDetections(data, indicatorNames) {

    let locationDetections = data.map(row => {
        return sumIndicatorValues(row, indicatorNames)
    })

    let totalDetections =
        locationDetections.reduce((sum, currentValue) => sum + currentValue, 0);

    return totalDetections
}

function getLocationsWithDetections(data,indicatorNames) {

    let locationDetections =
        data.map(row => {
            let output =
            {
                location: row.location,
                detections: sumIndicatorValues(row, indicatorNames)
            }
            return output
        }).filter(row => row.detections > 0)

    let uniqueLocations = [...new Set(locationDetections.map(row => row.location))].sort()

    return uniqueLocations

}

function getLocationsWithData(data, indicatorNames) {

    let locationWithData =
        data.map(row => {
            let output =
            {
                location: row.location,
                detections: sumIndicatorValues(row, indicatorNames)
            }
            return output
        }).filter(row => row.detections != null)

    let uniqueLocations = [...new Set(locationWithData.map(row => row.location))].sort()

    return uniqueLocations

}
