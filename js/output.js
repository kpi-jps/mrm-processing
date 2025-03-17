/** Populates a html select elements according data object  
 * @param {HTMLSelectElement} htmlSelect Select html element to populate
 * @param {{value : String, text : String} [] } data Array of data object containing the information used to populate the html select element
 * @param {() => any | null} onChange Function executed when the html select element triggers the change event 
 */
function populateOutputs(htmlSelect, data, onChange) {
    for (const d of data) {
        const op = document.createElement("option")
        op.value = d.value
        op.innerText = d.text
        htmlSelect.append(op)
    }
    if(onChange) htmlSelect.addEventListener("change", onChange)
}

