// Initial and constants
import { fetchData } from "./utils.js"
import { downloadSeasonOptions } from "./data-configuration-files/season-download-selector-options.js"
import * as tabs from "./pages/tab-buttons.js"
import * as latestWeek from "./pages/latest-week.js"
import * as latestSeason from "./pages/latest-season.js"
import * as locationExplorer from "./pages/location-explorer.js"
import * as dataDownload from "./pages/data-download.js"


// Initial load
$(function () {

    w3.includeHTML(function() {
        //setTimeout(buildViz, 1000) 
        buildViz()
    })

})

function buildViz() {

    tabs.initialiseTabButtons()
    var lastestWeekObjs = latestWeek.initialize()
    var lastestSeasonObjs = latestSeason.initialize()
    locationExplorer.initialize()
    dataDownload.initialize()

    $(".selectize-input input").attr('readonly','readonly');
    
    //

    let latestSeasonValue = downloadSeasonOptions[2].value
    let latestSeasonPath = `./data/${latestSeasonValue}`

    fetchData([latestSeasonPath], function (data) {

        let seasonDates = [...new Set(data.map(row => row.report_date))].sort()
        let latestDate = seasonDates[seasonDates.length - 1]
        latestDate = '2021-02-20'

        let latestWeekData = data.filter(row => row.report_date == latestDate)

        latestWeek.updateEventListeners(latestWeekData, lastestWeekObjs, latestWeek.updateStuff)
        latestWeek.updateStuff(latestWeekData, lastestWeekObjs)

        latestSeason.updateEventListeners(data, lastestSeasonObjs, latestSeason.updateStuff)
        latestSeason.updateStuff(data, lastestSeasonObjs)

        locationExplorer.updateEventListeners(data, locationExplorer.updateStuff)
        locationExplorer.updateStuff(data)

    })
}










