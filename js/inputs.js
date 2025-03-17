/**
* Apply a decimal number mask in html input text type element
* @param {HTMLInputElement} input A html input element 
* @throws {Error} Throws a error if html input id is a invalid value or don`t 
* corresponde to html input text element id;
*/
function decimalNumberInputMask(input) {
    if (input && input.tagName === "INPUT" && input.type === "text") {
        const decimalSeparator = "."
        const allowedChars = "0123456789" + decimalSeparator
        let count = 0
        let index = 0
        for (const char of input.value) {
            if (char === decimalSeparator) {
                count++
            }
            if (count > 1) {
                input.value = input.value.slice(0, index) + input.value.slice(index+1, input.value.length)
                return
            }
            if (!allowedChars.includes(char)) {
                input.value = input.value.slice(0, index) + input.value.slice(index+1, input.value.length)
                return
            }
            index++
        }
       return
    }
    throw new Error("The html element got by id is null, undefined or isn't an input type text")
}

/**
* Fits the input element witdth to its content 
* @param {HTMLInputElement} input A html input element 
* @throws {Error} Throws a error if html input id is a invalid value or don`t 
* corresponde to html input text element id;
 */
function inputFitContent(input) {
    if (input && input.tagName === "INPUT" && input.type === "text") {
        if(input.value.length === 0) {
            input.style.width = "3ch"
            return
        }
        input.style.width = input.value.length + "ch"
        return
    }
    throw new Error("The html element got by id is null, undefined or isn't an input type text")
}

