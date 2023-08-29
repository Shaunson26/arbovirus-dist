import { sumIndicatorValues } from "../utils.js"
import { indicatorOptions } from "../selectors/latest-selectors.js"

export function updateValueBoxes(data, page) {

    let numberOfDetections = getTotalNumberOfDetections(data)
    let numberOfLocationsWithDetections = getLocationsWithDetections(data).length
    let numberOfLocationsWithData = getLocationsWithData(data).length

    if (page == 'lrw') {
        $('#lrw-date-value').text(data[0].report_date)
        $('#lrw-detection-value').text(numberOfDetections)
        $('#lrw-location-detections-value').text(numberOfLocationsWithDetections)
        $('#lrw-location-with-data-value').text(numberOfLocationsWithData)
    }

    if (page == 'ls') {
        $('#ls-date-value').text(data[0].season)
        $('#ls-detection-value').text(numberOfDetections)
        $('#ls-location-detections-value').text(numberOfLocationsWithDetections)
        $('#ls-location-with-data-value').text(numberOfLocationsWithData)
    }

}

let indicatorNames = indicatorOptions.map(row => row.value)

function getTotalNumberOfDetections(data) {

    let locationDetections = data.map(row => {
        return sumIndicatorValues(row, indicatorNames)
    })

    let totalDetections =
        locationDetections.reduce((sum, currentValue) => sum + currentValue, 0);

    return totalDetections
}

function getLocationsWithDetections(data) {

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

function getLocationsWithData(data) {

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
