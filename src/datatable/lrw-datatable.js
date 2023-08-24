import { jsonToTable } from "../utils.js";

function addCss() {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = 'lrw-map-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './src/datatable/lrw-datatable.css';
    link.media = 'all';
    head.appendChild(link);
}

addCss()

export function updateLrwTable(data){

    $('#lrw-table-container').html(jsonToTable(data, 'lrw-data-table'));

    let table = document.querySelector('#lrw-data-table')

    table.classList.add("pageResize", "stripe", "compact", "row-border", "nowrap")

    new DataTable(table, {
        pageResize: true,
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
}