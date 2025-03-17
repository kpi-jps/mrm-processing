window.addEventListener("load", (e) => {

    //check if browser can run the application
    if (!window.sessionStorage) {
        const msg = "This browser can not run the application!"
        document.body.innerHTML = `<h3>${msg}</h3>`
        return
    }

    


    const method = document.getElementById("method")
    const next = document.getElementById("next")

    //populating the html select element (id = method)
    for (const m in constants.methods) {
        const o = document.createElement("option")
        o.value = m
        o.innerText = m
        method.append(o)
    }

    //setting function to run when html select element (id = method) changes
    method.addEventListener("change",
        //Updates the method value in session storage and the href value for next anchor
        (e) => {
            console.log(method.value)
            sessionStorage.setItem("method", method.value)
            const href = constants.methods[method.value]
            next.setAttribute("href", href)
            console.log(href)
        })

    //saving the initial "method" in session storage
    sessionStorage.setItem("method", method.value)

    //setting the initial href value for "next" anchor
    next.setAttribute("href", constants.methods[method.value])
})

