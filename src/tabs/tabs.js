/** Tabbed navigation module
 * 
 * 
 */

export function initialiseTabButtons() {

    let btns = document.getElementById('tab-buttons').children

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener('click', function () {
            let tabId = this.getAttribute('tab-id')
            showTab(tabId)
            //toggleSelectorDisplays(tabId)
            //toggleSelectorItems(tabId)
        })
    }
}

/** Tab shower
 * 
 * @param {String} id 
 */
function showTab(id) {

    var tabs = document.getElementsByClassName("tab");
    var tabButtons = document.getElementById('tab-buttons')
    tabButtons = tabButtons.children

    // Hide tabs
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }

    // Show tab and colour button
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('nsw-brand-accent')
        if (tabButtons[i].getAttribute('tab-id') == id) {
            document.getElementById(id).style.display = "block";
            tabButtons[i].classList.add('nsw-brand-accent')
        }
    }

    // Plotly tweak for resize
    //window.dispatchEvent(new Event('resize'));

}


