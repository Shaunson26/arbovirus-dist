import { fetchData, parseCsvText } from "../utils.js"
import { downloadSeasonOptions } from "../data-configuration-files/season-download-selector-options.js";
import { updateTable } from "../datatable/latest-datatables.js"

export function makeSeasonSelector(id) {
    let selectize = $(id).selectize({
        plugins: ['remove_button'],
        maxItems: null,
        valueField: 'value',
        labelField: 'label',
        options: downloadSeasonOptions,
    })

    return selectize
}

export function addDownloadEventListener() {

    $('#download-season-button').on('click', function () {
        let seasonsToDownload = $('#download-season')[0].selectize.items

        if (seasonsToDownload.length == 0) {
            return
        }

        seasonsToDownload = seasonsToDownload.map(file => `./data/${file}`)

        var modal = document.getElementById('download-modal')
        modal.style.display = 'block'

        fetchData(seasonsToDownload, function (data) {
            updateTable('download-table-container', data)
            modal.style.display = 'none'
        })
    })
}


