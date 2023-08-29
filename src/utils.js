/**
 * 
 * @param {*} path 
 * @param {*} callback 
 */
export function fetchData(paths, callback) {

    let isNotArray = !Array.isArray(paths)

    if (isNotArray) {
        throw new Error('paths must be an array of paths/urls')
    }

    // Fetch and parse CSV into JSON
    async function fetchAndParseCsv(path) {
        const response = await fetch(path);
        let data = await response.text();
        data = parseCsvText(data)
        return data
    }



    // Fetch all concurrently
    const fetchPromises = paths.map(url => fetchAndParseCsv(url));

    // Wait for all requests to complete
    Promise.all(fetchPromises)
        .then(jsonDataArray => {
            // Concatenate JSON data into a single object
            const concatenatedData = jsonDataArray.reduce((acc, jsonData) => {
                return acc.concat(jsonData);
            }, []);

            callback(concatenatedData)
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });

}

/**
 * 
 * @param {*} url 
 * @returns 
 */
export function checkFileExists(fileUrl) {

    fetchFile(fileUrl).then(exists => {
        if (!exists) {
            throw new Error(`File ${fileUrl} not found`);
        }
    });

    function fetchFile(url) {
        return fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return false;
            });
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} href 
 * @returns 
 */
export function addCss(id, href) {

    checkFileExists(href)

    var exists = document.getElementById(id) !== null

    if (exists) {
        console.log('returning css')
        return
    }

    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    link.media = 'all';

    head.appendChild(link);
}

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
            transform: function (value) { return value === '' ? null : value },
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

    let keysNotArray = !Array.isArray(keys)

    if (keysNotArray) {
        throw new Error('keys must be an array')
    }

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

    // Build the table header
    const header = `<thead><tr>${mapKeys(jsonData)}</tr></thead>`;

    // Build the table body
    const body = `<tbody>${mapRows(jsonData)}</tbody>`

    // Build the final table
    const table = `<table id="${tableId}"> ${header}${body}</table> `;

    return table;

    function mapKeys(data) {
        const keys = Object.keys(data[0]);
        return keys.map(key => `<th>${key}</th>`).join('')
    }

    function mapCells(data) {
        return data.map(cell => {
            cell = cell == null ? '' : cell
            return `<td>${cell}</td>`
        }).join('');
    }

    function mapRows(data) {
        return data.map(row => {
            return `<tr>${mapCells(Object.values(row))}</tr>`
        }).join('');
    }

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
 * 1 + 1 + 2 + null = 4
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

export function uniqueArray(data, key) {
    return [...new Set(data.map(row => row[key]))]

}