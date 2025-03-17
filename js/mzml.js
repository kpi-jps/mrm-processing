
/**
 * Accession terms used to identify and get xml elements after parses mzML files to xml
 * obtained in: https://raw.githubusercontent.com/HUPO-PSI/psi-ms-CV/master/psi-ms.obo
 */
const AccessionTerms = Object.freeze({
    mrm: "MS:1001473",
    tic: "MS:1000235",
    intensityArray: "MS:1000515",
    targetMZ: "MS:1000827",
    zlibCompression: "MS:1000574",
    noCompression: "MS:1000576",
    decode64BitsInt: "MS:1000522",
    decode64BitsFloat: "MS:1000523",
    decode32BitsInt: "MS:1000519",
    decode32BitsFloat: "MS:1000521"
})

/**
* Decodes the base64 input string
* @param {String} base64Input Base 64 input string
* @returns {Uint8Array}
*/
function base64Decoder(base64Input) {
    const binString = atob(base64Input);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

/**
* Decompress bytes into a UTF-8 string using deflate algorithm
* @param {Uint8Array} compressedBytes Array of compressed bytes
* @returns {Promise<Uint8Array>}
*/
async function deflateDecompressor(compressedBytes) {
    // Convert the bytes to a stream.
    const stream = new Blob([compressedBytes]).stream();

    // Create a decompressed stream.
    const decompressedStream = stream.pipeThrough(
        new DecompressionStream("deflate")
    );

    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of decompressedStream) {
        chunks.push(chunk);
    }

    const blob = new Blob(chunks);
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
}

/**
 * Parses the mzML files to XML document
 * @param {Array<File>} files  Array of mzML files
 * @returns {Promise<{docName : Document}>}
 */
async function parseMZMLFiles(files) {
    const mzmls = {}
    for (const file of files) {
        const parser = new DOMParser()
        const content = await file.text()
        const mzml = parser.parseFromString(content, "application/xml")
        mzmls[file.name] = mzml
    }
    return mzmls
}

/**
 * Sets the mrmId based on q1 an q3 MS values
 * @param {Number} q1 
 * @param {Number} q3 
 * @returns {String}
 */
function setMRMId(q1, q3) {
    return `${q1.toFixed(1)}/${q3.toFixed(1)}`
}

/**
 * Performs and returns the sum of mrm intensities
 * @param {Number []} intensities Array of mrm intensity values
 * @returns {Nuumber}
 */
function sumMRMIntensity(intensities) {
    let intensitySum = 0
    for (const value of intensities) intensitySum += value
    return intensitySum
}

/**
* Process and extract form mzML files mrm's and their intensities
* @param {Document} mzml Parsed to XML mzML file
* @returns {Promise<{mrm : Number}>}
*/
async function processMZMLFiles(mzml) {
    const result = {}
    const cVParamNodes = mzml.querySelectorAll("cvParam")
    const targetNodes = Array.from(cVParamNodes).filter(node => node.getAttribute("name") === "intensity array")
    for (const node of targetNodes) {
        const cromatogram = node.parentElement.parentElement.parentElement
        const precursor = cromatogram.querySelector("precursor")
        const product = cromatogram.querySelector("product")
        if (!precursor && !product) continue
        const precursorCvParam = precursor.querySelector("cvParam")
        const productCvParam = product.querySelector("cvParam")
        const q1 = precursorCvParam && precursorCvParam.hasAttribute("value") ?
            Number(precursorCvParam.getAttribute("value")) : null
        const q3 = productCvParam && productCvParam.hasAttribute("value") ?
            Number(productCvParam.getAttribute("value")) : null
        if (q1 && q3) {
            let el = node.parentElement.firstChild
            let isCompressed = false
            let isFloat64Encoded = true
            let binary
            while (el) {
                if (el.nodeName === "binary") {
                    binary = el.textContent
                }
                if (el.nodeName === "cvParam") {
                    const accession = el.getAttribute("accession")
                    switch (true) {
                        case accession === AccessionTerms.decode64BitsFloat || accession === AccessionTerms.decode64BitsInt:
                            isFloat64Encoded = true
                            break
                        case accession === AccessionTerms.decode32BitsFloat || accession === AccessionTerms.decode32BitsInt:
                            isFloat64Encoded = false
                            break
                        case accession === AccessionTerms.zlibCompression:
                            isCompressed = true
                            break
                        case accession === AccessionTerms.noCompression:
                            isCompressed = false
                            break;
                    }
                }
                el = el.nextSibling
            }
            let data
            if (isCompressed) data = await deflateDecompressor(base64Decoder(binary))
            else data = base64Decoder(binary)

            const mrmId = setMRMId(q1, q3)

            const intensity = sumMRMIntensity(
                isFloat64Encoded ? new Float64Array(data.buffer) : new Float32Array(data.buffer)
            )
            result[mrmId] = intensity 
        }
    }
    return result
}