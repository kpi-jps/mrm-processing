/**
 * Logs actions while processing mzML files
 * @param {HTMLElement} htmlEl Html element used as log container
 * @param {String} msg The message to log
 */
function logging(htmlEl, msg) {
    const date = new Date()
    htmlEl.innerText += `> ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} : ${msg} \n`
    htmlEl.scrollBy(0, 1000)
}

/**
 * Clears the log
 * @param {HTMLElement} htmlEl Html element used as log container
 */
function clearLog(htmlEl) {
    htmlEl.innerText = ""
}

/**
 * Starts the processing indicator while processing mzML files
 * @param {HTMLElement} htmlEl The html element used as processing indicator 
 * @param {()} callback The callback function executed when processing indicator is started 
 * @returns {Number} 
 */
function startProcessingIndicator(htmlEl, callback) {
    htmlEl.innerText = "Processing"
    const initialLength = htmlEl.innerText.length
    const interval = setInterval(() => {
        htmlEl.innerText.length <= initialLength + 3 ? 
            htmlEl.innerText += "." : 
            htmlEl.innerText = htmlEl.innerText.substring(0, initialLength)
        }, 500)
    if(callback) callback()
    return interval
}

/**
 * Stops the processing indicator while processing mzML files
 * @param {HTMLElement} htmlEl The html element used as processing indicator 
 * @param {Number} interval Holds the interval variable  
 * @param {()} callback The callback function executed when processing indicator is ended 
 */
function stopProcessingIndicator(htmlEl, interval, callback) {
    clearInterval(interval)
    htmlEl.innerText = "Done!"
    if(callback) callback()
}

