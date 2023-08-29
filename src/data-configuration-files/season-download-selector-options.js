import { parseCsvText } from "../utils.js";
const response = await fetch("./src/data-configuration-files/season-download-selector-options.csv");
const downloadSeasonOptionsText = await response.text();
export let downloadSeasonOptions = parseCsvText(downloadSeasonOptionsText)