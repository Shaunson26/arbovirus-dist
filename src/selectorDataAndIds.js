export let selectorDataAndIds = {

    yearFiles: ["2023.json", "2022.json", "2021.json", "2020.json", "2019.json", "2018.json", "2017.json", "2016.json", "2015.json", "2014.json", "2013.json", "2012.json", "2011.json", "2010.json", "2009.json", "2008.json", "2007.json", "2006.json", "2005.json", "2004.json", "2003.json", "2002.json", "2001.json", "2000.json", "1999.json", "1998.json", "1997.json", "1996.json", "1995.json", "1994.json", "1993.json", "1992.json", "1991.json", "1990.json", "1989.json"]
    ,
    selectorIds: {
        year: 'year-selector',
        measure: 'measure-selector',
        indicator: 'indicator-selector',
        siteType: 'site-type-selector',
        date: 'map-date-slider',
        location: 'location-selector',
        selectAll: 'location-selectall'
    }
    ,
    indicators:
        [
            { "indicator": "sindbis", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "ross_river", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "kunjin", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "edge_hill", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "barmah_forest", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "stratford", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "kokobera", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "unknown", "measure_group": "Virus detections", "legend_group": "detections" }, { "indicator": "mvev", "measure_group": "Virus detections", "legend_group": "detections" },
            { "indicator": "total_mosquito", "measure_group": "Mosquito abundances", "legend_group": "counts" }, { "indicator": "culex_annulirostris", "measure_group": "Mosquito abundances", "legend_group": "counts" }, { "indicator": "aedes_vigilax", "measure_group": "Mosquito abundances", "legend_group": "counts" }
        ]
    ,
    siteTypes: ['All', 'Coastal', 'Inland', 'Sydney']
}