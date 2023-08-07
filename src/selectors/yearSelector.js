import { selectorDataAndIds } from "../selectorDataAndIds.js"

let yearSelector = document.getElementById(selectorDataAndIds.selectorIds.year)
let yearOptions = selectorDataAndIds.yearFiles.map(value => ({ value: value, label: value.replace(/.json/, '') }))

var $yearSelector = $(yearSelector)
    .selectize({
        plugins: ['remove_button'],
        maxItems: null,
        valueField: 'value',
        labelField: 'label',
        options: yearOptions,
        items: [yearOptions[0].value],
    });

function updateYearSelectorOnChange(callback) {
    $yearSelector.off('change');
    //let items = $yearSelector[0].selectize.items
    //console.log(items)
    //$yearSelector[0].selectize.setValue(items.sort())
    //console.log(items)
    $yearSelector.on('change', function () {
        callback()
    })
}

export { updateYearSelectorOnChange }