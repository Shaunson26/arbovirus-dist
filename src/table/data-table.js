/**
 * Arbovirus map visualisation
 * 
 */

//import $ from 'jquery'
//import "../../node_modules/datatables.net-dt/css/jquery.dataTables.min.css"
//import "../../node_modules/datatables.net-buttons-dt/css/buttons.dataTables.min.css"
//import DataTable from 'datatables.net-dt';
//import 'datatables.net-buttons-dt';
//import 'datatables.net-buttons/js/buttons.html5.mjs';
//import { selectionIds } from "../selectors/selectors.js" // names of visualisation variables
//import { locations } from "../../data/locations.js"; // location metadata array

let tableContainerId = "table-container"

/** Initial a datatable from a HTML table
 * 
 * @param {Array} data JSON object array
 * @param {String} containerId ID of container to append the table
 * @param {String} tableId ID to add to the created table
 * @returns 
 */
export function updateDataTable(data, config) {

    let container = document.getElementById(tableContainerId)

    // let tabNotVisible =
    //     document.getElementById('table-tab').style.display == 'none'

    // if (tabNotVisible) {
    //     console.log('skipping table update')
    //     return
    // }

    // Get date and value to show
    // Get date and value to show ----
    let year = config.year
    let indicator = config.indicator
    let date = config.date
    let siteType = config.siteType
    let locationsSelected = config.location //['Bankstown', 'Bayside']
    
    if (locationsSelected.length == 0){
        container.innerText = 'Pick a location'
        return   
    }

    // // Examine current data and exit if no update needed
    // let showingValue = decade + indicator + siteType
    // let container = document.getElementById(containerId)
    // let containerShowing = container.getAttribute('data-showing')

    // if (containerShowing !== null && containerShowing.includes(showingValue)) {
    //     console.log('table already displayed')
    //     return
    // }

    // Update
    let tableExists = document.getElementById('data-table-1') !== null

    if (tableExists) {
        console.log('removing table')
        $('#data-table-1').dataTable().fnDestroy()
        let element = document.getElementById("data-table-1");
        element.remove();
    }

    let dataSelected =
        data
        .filter(row => locationsSelected.includes(row.location))
        .map(row => subsetKeys(row, ['location', 'weekendDate'].concat(indicator)))

    container.innerHTML = jsonToTable(dataSelected, 'data-table-1');

    let table = document.getElementById('data-table-1')

    // Datatable styling classes

    table.classList.add("stripe", "compact", "row-border", "nowrap")

    let datatable = new DataTable(table, {
        dom: 'fBtip',
        columnDefs: [
            { targets: '_all', className: 'dt-head-center' },
            { targets: '_all', className: 'dt-body-center' },
            { targets: [0], className: 'dt-body-right' },

        ],
        buttons: [{
            extend: 'csv',
            text: 'Export to CSV',
            className: "nsw-brand-dark nsw-brand-accent-hover"
        }],
    });

    //container.setAttribute('data-showing', indicator + siteType)


}

/** Convert JSON data to HTML table
 * 
 * @param {Array} jsonData JSON object array
 * @param {String} tableId ID to add to the created table
 *  
 */
export function jsonToTable(jsonData, tableId) {

    // Get keys (=cells) of each items
    const keys = Object.keys(jsonData[0]);

    // Build the table header
    const header = `<thead><tr>` + keys
        .map(key => `<th>${key}</th>`)
        .join('') + `</thead></tr>`;

    // Build the table body
    const body = `<tbody>` +
        jsonData.map(row => `<tr>${Object.values(row)
            .map(cell => `<td>${cell}</td>`)
            .join('')}</tr>`)
            .join('');

    // Build the final table
    const table = `<table id="${tableId}">${header}${body}</table>`;

    return table

}

function subsetKeys(object, keys) {
    // Initialize an empty object to store the subset
    const subset = {};

    // Loop through the keys array
    for (const key of keys) {
        // Check if the key exists in the object
        if (object.hasOwnProperty(key)) {
            // Add the key-value pair to the subset object
            subset[key] = object[key];
        }
    }

    return subset;
}

