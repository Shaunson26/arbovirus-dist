
console.log('pcad loaded')

export function parseCsvAndDo(callback) {
    
    Papa.parse("../data/data.csv", {
        download: true,
        header: true,
        complete: function (results, file) {
            //console.log("Parsing complete:", results, file);
            callback(results.data)
        }
    })

}