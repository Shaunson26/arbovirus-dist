import { jsonToTable, addCss } from "../utils.js";

addCss('latest-datatable-css', './src/datatable/latest-datatables.css')

/**
 * Create a datatable
 * @param {} id_suffix suffix to link related items
 * @param {*} data 
 */
export function updateTable(id_suffix, data) {

    if (typeof data === 'undefined') {
        throw new Error('Missing argument: "data" is required.');
    }

    const tableId = `${id_suffix}-table-container`,
        innerTableId = tableId + '-data-table'

    $(`#${tableId}`).html(jsonToTable(data, innerTableId));

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

export function triggerDataTablePageResize(tableId) {
    $(`${tableId}>object`)[0].contentDocument.defaultView.dispatchEvent(new Event('resize'))
}