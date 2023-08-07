
/**
 * Fetch JSONs files from selector and run a callback when done
 * 
 * @param {Function} callback 
 */
export function fetchDataAndDo(callback) {

    //$("#loading-modal").show()

    let selectedFiles = $('#year-selector').data('selectize').items

    // if (selectedFiles.length == 0){
    //     return
    // }

    fetchJsons(selectedFiles, callback)

}

/**
 * Fetch an array of JSON files and return a concat of response.json()s 
 * @param {*} files 
 * @param {*} callback 
 */
function fetchJsons(files, callback) {

    let fetchedJsonPromises =
        files.map(file => {
            let result =
                fetch(`./data/${file}`)
                    .then(response => response.json())
            return result
        })

    Promise
        .all(fetchedJsonPromises)
        .then(jsons => {
            let data = [];

            for (let json of jsons) {
                // columns to
                let jsonFormatted = jsonColumnToRows(json)
                data = data.concat(jsonFormatted)
            }
            callback(data)
        })
        .catch((error) => {
            console.error(`Failed to fetch: ${error}`);
        });

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
function jsonColumnToRows(inputObject) {

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


