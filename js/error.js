/**
 * Show error messages when error occurs
 * @param {String} msg Error msg
 * @param {()} callback Callback function to be executed when error occurs 
 */
function error(msg, callback) {
    const container = document.getElementById("error")
    const info = document.getElementById("info")
    const close = document.getElementById("close")
    container.classList.remove("hidden")
    info.innerHTML = msg
    close.addEventListener("click", (e) => container.classList.add("hidden"))
    setTimeout(() => container.classList.add("hidden"), 3000) 
    if(callback) callback()
}