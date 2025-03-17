window.addEventListener("load", (e) => {

    //check if browser can run the application
    if (!window.sessionStorage) {
        const msg = "This browser can not run the application!"
        document.body.innerHTML = `<h3>${msg}</h3>`
        return
    }

    const method = sessionStorage.getItem("method")

    if (!method) error("The processing method is not defined!", () => {
        document.querySelectorAll(".input").forEach(i => i.classList.add("hidden"))
        document.querySelectorAll(".output").forEach(i => i.classList.add("hidden"))
        document.querySelectorAll(".processing").forEach(i => i.classList.add("hidden"))
    })

    if (method && typeof method !== "string") {
        for (const href in constants.methods) if (constants.methods[i].includes(location.href)) return
        error("The processing method is invalid!", () => {
            document.querySelectorAll(".input").forEach(href => href.classList.add("hidden"))
            document.querySelectorAll(".output").forEach(href => href.classList.add("hidden"))
            document.querySelectorAll(".processing").forEach(href => href.classList.add("hidden"))
            document.getElementById("cover").classList.add("hidden")
        })
    }

    const uploadSamples = document.getElementById("upload-samples")
    const downloadLog = document.getElementById("download-log")
    const start = document.getElementById("start")
    const output = document.getElementById("output")
    const download = document.getElementById("download")

    uploadSamples.addEventListener("click", (e) => {
        e.preventDefault()
        const samples = document.getElementById("samples")
        const info = document.getElementById("samples-info")
        samples.click()
        samples.addEventListener("change", () => info.innerText = `It was uploaded ${samples.files.length} file(s).`)
    })

    start.addEventListener("click", async (e) => {
        e.preventDefault()
        const data = {}
        const files = document.getElementById("samples").files
        if (files.length === 0) {
            error("No sample files were uploaded!", null)
            return
        }
        const indicator = document.getElementById("indicator")
        const log = document.getElementById("log")
        const processing = document.getElementById("processing")
        const interval = startProcessingIndicator(indicator, () => document.getElementById("cover").classList.remove("hidden"))
        const outputs = document.getElementById("outputs")
        logging(log, `Start processing using method ${method}.`)
        processing.classList.remove("hidden")
        output.classList.remove("hidden")
        const mzmls = await parseMZMLFiles(files)
        for (const mzml in mzmls) {
            data[mzml] = await processMZMLFiles(mzmls[mzml])
            logging(log, `Processing file ${mzml}.`)
        }
        logging(log, `It was processed ${files.length} mzML file(s).`)

        switch (method) {
            case Object.keys(constants.methods)[0]:
                const mrms = []
                let content = ""
                for (const run in data) {
                    let index = 0
                    for (const mrm in data[run]) {
                        if (!mrms.includes(mrm)) {
                            logging(log, `Selecting mrm ${mrm}.`)
                            mrms.push(mrm)
                            content += index === 0 ? mrm : `,${mrm}`
                            index++
                            continue
                        }
                    }
                }
                const link = URL.createObjectURL(new Blob([content], {type : "text/csv"}))
                logging(log, `It was grouped ${mrms.length} mrm's.`)
                populateOutputs(outputs, [{value : link, text : method}], () => download.setAttribute("href", outputs.value))
                download.setAttribute("href", outputs.value)
                break

            default:
                error("The processing method is invalid!", () => {
                    document.querySelectorAll(".input").forEach(href => href.classList.add("hidden"))
                    document.querySelectorAll(".output").forEach(href => href.classList.add("hidden"))
                    document.querySelectorAll(".processing").forEach(href => href.classList.add("hidden"))
                    document.getElementById("cover").classList.add("hidden")
                })
                return
        }
        downloadLog.setAttribute("href", URL.createObjectURL(new Blob([log.innerText], { type: "text/plain" })))
        logging(log, `Ending processing.`)
        stopProcessingIndicator(indicator, interval, () => document.getElementById("cover").classList.add("hidden"))

    })

})

