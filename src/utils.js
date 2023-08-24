
/**
 * Parse a CSV string
 * @param {string} text 
 * @returns 
 */
export function parseCsvText(text) {
    let papa_results =
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            transform: function(value){ return value === '' ? null : value},
            dynamicTyping: true,
            complete: function (results, file) {
                return results
            }
        })
    return papa_results.data
}

/**
 * 
 * @param {*} object 
 * @param {*} keys 
 * @returns 
 */
export function subsetObject(object, keys) {
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

/** Convert JSON data to HTML table
 * 
 * @param {Array} jsonData JSON object array
 * @param {String} tableId ID to add to the created table
 *  
 */
export function jsonToTable(jsonData, tableId) {

    if (jsonData.length == 0) {
        return `<table id="${tableId}">No data available</table>`
    }

    // Get keys (=cells) of each items
    const keys = Object.keys(jsonData[0]);

    // Build the table header
    const header = `<thead><tr>` + keys
        .map(key => `<th>${key}</th>`)
        .join('') + `</thead></tr>`;

    // Build the table body
    const body = `<tbody>` +
        jsonData.map(row => `<tr>${Object.values(row)
            .map((cell,i) => `<td class=${tableId}-${i}>${cell}</td>`)
            .join('')}</tr>`)
            .join('');

    // Build the final table
    const table = `<table id="${tableId}">${header}${body}</table>`;

    return table

}

/**
 * Restructure a json 
 * 
 * const inputObject = { location: ['a', 'b'], y: [1, 2], z: ['x', 'y'] };
 * const resultArray = convertObjectToArray(inputObject);
 * console.log(resultArray);
 * 
 * [
 * { location: 'a', y: 1, z: 'x' },
 * { location: 'b', y: 2, z: 'y' }
 * ]
 * 
 * @param {Object} inputObject 
 * @returns Array
 */
export function jsonColumnToRows(inputObject) {

    const keys = Object.keys(inputObject);
    const inputArray = inputObject[keys[0]];
    const resultArray = [];

    inputArray.forEach((value, index) => {
        const newObj = {};
        keys.forEach(key => {
            newObj[key] = inputObject[key][index];
        });
        resultArray.push(newObj);
    });

    return resultArray;
}

/**
 * 
 * const data = [
 * { location: 'a', y: 1, z: 1 },
 * { location: 'b', y: 2, z: null }
 * ]
 * const indicators = ['y','z']
 * const result = sumIndicatorValues(inputObject);
 * console.log(result);
 * 1 + 1 + 2 = 4
 * 
 * @param {*} data 
 * @param {*} indicators 
 * @returns 
 */
export function sumIndicatorValues(data, indicators) {

    var sum = null;

    indicators.forEach(indictor => {
        let indictorPresent = data.hasOwnProperty(indictor)
        if (indictorPresent) {
            let value = data[indictor]
            if (value != null) {
                sum += data[indictor]
            }
        }
    })

    return sum
}