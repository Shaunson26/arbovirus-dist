// Initial and constants
import { fetchData } from "./utils.js"
import { downloadSeasonOptions } from "./data-configuration-files/season-download-selector-options.js"
import * as tabs from "./pages/tab-buttons.js"
import * as latestWeek from "./pages/latest-week.js"
import * as latestSeason from "./pages/latest-season.js"
import * as dataDownload from "./pages/data-download.js"
import * as locationExplorer from "./pages/location-explorer.js"

//tabs.showTab('season-tab')
//tabs.showTab('chart-tab-by-indicator')
//tabs.showTab('chart-tab-by-indicator-heatmap')

tabs.initialiseTabButtons()
dataDownload.makeSeasonSelector('#download-season')
dataDownload.addDownloadEventListener()

// Initial load
$(function () {

    let latestSeasonValue = downloadSeasonOptions[2].value
    let latestSeasonPath = `./data/${latestSeasonValue}`

    fetchData([latestSeasonPath], function (data) {        

        let seasonDates = [...new Set(data.map(row => row.report_date))].sort()
        let latestDate = seasonDates[seasonDates.length - 1]   
        latestDate = '2021-02-20'

        let latestWeekData = data.filter(row => row.report_date == latestDate)

        latestWeek.updateEventListeners(latestWeekData, latestWeek.updateStuff)
        latestWeek.updateStuff(latestWeekData)

        //
        latestSeason.updateEventListeners(data, latestSeason.updateStuff)
        latestSeason.updateStuff(data)

        locationExplorer.updateEventListeners(data, locationExplorer.updateStuff)
        locationExplorer.updateStuff(data)
    
    })
  

    //tabs.showTab('location-explorer')


})











