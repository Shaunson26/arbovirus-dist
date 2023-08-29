import { jsonToTable, addCss } from "../utils.js";

addCss('latest-datatable-css', './src/datatable/latest-datatables.css')

export function updateTable(id, data) {

    if (typeof data === 'undefined') {
        throw new Error('Missing argument: "data" is required.');
    }

    let innerTableId = id + '-data-table'

    $(`#${id}`).html(jsonToTable(data, innerTableId));

    let table = document.querySelector(`#${innerTableId}`)

    table.classList.add("pageResize", "stripe", "compact", "row-border", "nowrap")

    new DataTable(table, {
        pageResize: true,
        dom: 'fBtip',
        columnDefs: [
            { targets: '_all', className: 'dt-head-center' },
            { targets: '_all', className: 'dt-body-center' },
            { targets: [0], className: 'dt-body-right' }
        ],
        buttons: [{
            extend: 'csv',
            text: 'Export to CSV',
            className: "nsw-brand-dark nsw-brand-accent-hover"
        }],
    });
}

export function triggerDataTablePageResize(id){
    $(`${id}>object`)[0].contentDocument.defaultView.dispatchEvent(new Event('resize'))
}