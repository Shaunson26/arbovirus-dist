import { sumIndicatorValues } from "../utils.js"
import { lrwSelectorOptions } from "../selectors/lrw-selectors.js"

export function updateValueBoxes(data){
    let numberOfDetections = getTotalNumberOfDetections(data)
    let numberOfLocationsWithDetections = getLocationsWithDetections(data).length

    $('#latest-report-week-date-value').text(data[0].report_date)
    $('#lrw-detection-value').text(numberOfDetections)
    $('#lrw-location-detections-value').text(numberOfLocationsWithDetections)

}

let indicatorNames = lrwSelectorOptions.map(row=>row.value)

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

    return locationDetections

}
