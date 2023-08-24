
import { parseCsvText } from "../utils.js";

function addCss() {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = 'lrw-selector-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './src/selectors/lrw-selectors.css';
    link.media = 'all';
    head.appendChild(link);
}

addCss()

// Fetch idem
const response = await fetch("./src/data-configuration-files/lrw_selector_options.csv");
const lrwOptionsText = await response.text();

let lrwSelectorOptions = parseCsvText(lrwOptionsText)
let optgroups = lrwSelectorOptions.map(row => row.optgroup)
optgroups = [...new Set(optgroups)].map(value => ({ groupName: value }))


let $lrwIndicatorSelector = $('#lrw-indicators').selectize({
    plugins: ['remove_button'],
    maxItems: null,
    valueField: 'value',
    labelField: 'label',
    optgroups: optgroups,
    optgroupLabelField: 'groupName', // refers to the label field in "optgroups"
    optgroupValueField: 'groupName',
    optgroupField: 'optgroup',
    options: lrwSelectorOptions,
    onChange: function () {
        console.log(this.items)
    }

})

function updateLrwIndicatorSelectorOnChange(data, callback) {

    let instance = $lrwIndicatorSelector[0].selectize

    instance.off('change');

    instance.on('change', function () {
        callback(data)
    })
}

let $lrwDisplaySelector = $('#lrw-display').selectize({
    dropdownParent: 'body',
    onChange: function () {
        let toShow = this.items[0]
        let mapDiv = document.querySelector('#lrw-map')
        let tableDiv = document.querySelector('#lrw-table')

        if (toShow == 'map') {
            tableDiv.style.display = "none";
            mapDiv.style.display = "block";
        }
        if (toShow == 'table') {
            mapDiv.style.display = "none";
            tableDiv.style.display = "block";
            $('#lrw-table-container>object')[0].contentDocument.defaultView.dispatchEvent(new Event('resize'))
        }
    }
});

function updateLrwTableCheckboxOnChange(data, callback) {

    let checkboxes = [
        $('#lrw-include-counts'),
        $('#lrw-include-environmental-params')
    ]

    checkboxes.forEach(checkbox => {

        checkbox.off('change');

        checkbox.on('change', function () {
          
            callback(data)
        })
    })

  
}



export { updateLrwIndicatorSelectorOnChange, updateLrwTableCheckboxOnChange, lrwSelectorOptions }

