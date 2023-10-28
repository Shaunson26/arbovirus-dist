// Initial and constants
// w3.* - w3.js not a module and loaded in index.html
import { fetchData } from "./utils.js"
import { downloadSeasonOptions } from "./data-configuration-files/season-download-selector-options.js"
import * as tabs from "./pages/tab-buttons.js"
import * as latestWeek from "./pages/latest-week.js"
import * as latestSeason from "./pages/latest-season.js"
import * as locationExplorer from "./pages/location-explorer.js"
import * as dataDownload from "./pages/data-download.js"

/**
 *  Initial page load function
 * 
 *  - include HTML components (<w3-include-html=>) and 
 *    run buildViz when completeBuild arbovirus data visualisation
 * 
 */
$(function () {
    w3.includeHTML(buildViz)
})

/**
 *  Build arbovirus data visualisation
 * 
 *  - initialise tab (page navigation) buttons
 *  - initialise page components: selectors, maps, plots, tables
 *  - fetch initial data and update to components and event listeners
 * 
 */

function buildViz() {

    // Initialise
    tabs.initialiseTabButtons()
    var lastestWeekObjs = latestWeek.initialize()
    var lastestSeasonObjs = latestSeason.initialize()
    //locationExplorer.initialize()
    //dataDownload.initialize()
	
	$(".selectize-input input").attr('readonly','readonly');
    
    // Initial data fetch and component update

    let latestSeasonValue = downloadSeasonOptions[0].value
    let latestSeasonPath = `./data/${latestSeasonValue}`

    fetchData([latestSeasonPath], function (data) {

        let seasonDates = [...new Set(data.map(row => row.report_date))].sort()
        let latestDate = seasonDates[seasonDates.length - 1]
        //latestDate = '2021-02-20'

        let latestWeekData = data.filter(row => row.report_date == latestDate)

        latestWeek.updateEventListeners(latestWeekData, lastestWeekObjs, latestWeek.updateStuff)
        latestWeek.updateStuff(latestWeekData, lastestWeekObjs)

        latestSeason.updateEventListeners(data, lastestSeasonObjs, latestSeason.updateStuff)
        latestSeason.updateStuff(data, lastestSeasonObjs)

        // locationExplorer.updateEventListeners(data, locationExplorer.updateStuff)
        // locationExplorer.updateStuff(data)

    })
}










