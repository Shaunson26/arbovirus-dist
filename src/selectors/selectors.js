/**
 * Arbovirus selector elements
 * 
 * - Objects to select and fill input tags.
 * - selectorDataAndIds is an object with configuration values to fill elements
 */

// jQuery loaded globally
import { updateYearSelectorOnChange } from "./yearSelector.js"
import { updateIndicatorSelectorOnChange } from "./indicatorSelector.js" // must come before measure
import {} from "./measureSelector.js"
import { updateSiteTypeSelectorOnChange } from "./siteTypeSelector.js"
import { updateDateSliderValues, updateDateSliderOnChange } from "./dateSlider.js"
import { updateLocationSelectorOnChange, updateLocationSelectorOptions } from "./locationSelector.js"

// Export functions requiring data
export {
    updateYearSelectorOnChange, updateIndicatorSelectorOnChange, updateSiteTypeSelectorOnChange,
    updateDateSliderValues, updateDateSliderOnChange, updateLocationSelectorOnChange,
    updateLocationSelectorOptions
}