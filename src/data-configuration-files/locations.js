/**
 * Import the locations dimension object
 */
import { parseCsvText } from "../utils.js"

const response = await fetch("./src/data-configuration-files/locations.csv");
let responseText = await response.text();
export const locations = parseCsvText(responseText)
