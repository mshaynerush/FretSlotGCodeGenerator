

function fretsTest() {
    // Set values for x widths and y distances
    // Get value of first fret based on scale length
    // Use firstFret value to generate the distance to each fret from the nut

    // Gather User Inputs

    scale = document.getElementById("scale").value
    divConstant = 17.817
    gUnitValue = document.querySelector('input[name="unit"]:checked').value;
    console.log("Unit: " + gUnitValue)
    numFrets = document.getElementById("numFrets").value
    bitDiameter = document.getElementById("bitDiameter").value
    firstFret = scale / divConstant
    base1 = document.getElementById("lastFretWidth").value
    base2 = document.getElementById("nutWidth").value



    // Set Arrays to hold widths and distances from nut for frets
    yDistances = []
    fretboardWidths = []
    
    yDistances = setFretDistances(firstFret, numFrets, divConstant)

    // get widths of the fretboard at each ydistance

    yDistances.map(fret => {
        totalLength = yDistances[numFrets - 1]
        
        // to simplify the linear equation each part of the equation is figured separately then added together

        if(gUnitValue === "G20"){
            fretWidthReduction = inchConversion(bitDiameter)
            
        } else {
            fretWidthReduction =  2 + (bitDiameter)
        }

        byBase1 = fret/totalLength
        byBase2 = totalLength - byBase1
        console.log("Bases: " + byBase1 * byBase2)

        currentFretWidth += ((fret/totalLength) * base1) 
        currentFretWidth += ((totalLength - (fret/totalLength)) * base2) 
        currentFretWidth -= fretWidthReduction
        console.log("currentFretWidth: " + currentFretWidth)
        if(gUnitValue === "G20"){
            currentFretWidth = parseFloat(currentFretWidth / 25.400)
            console.log("currentFretWidth: " + currentFretWidth)
        }
        

        
        fretboardWidths.push(currentFretWidth)
    })
 
        createGCode(yDistances, fretboardWidths)
}


function inchConversion(bitDiameter){

    // returns a value 2mm less than total width of fretboard plus an additional half of the bit size to keep 1mm on each side of the slot
    return 2 / 25.4 + ((bitDiameter))

}


function createGCode(yDistances, fretboardWidths){

    // get the cutting speed 
    cutSpeed = document.getElementById("cutSpeed").value
    cutSpeed = Number(cutSpeed).toFixed(0)
    // get window to retun G Code to
    gCodeWindow = document.getElementById("gCodeWin")

    // safe travel height
    if(gUnitValue === "G20"){
        safeTravel = .025
    } else {
        safeTravel = 3.0
    }

    gCodeWindow.innerHTML = "(Created by Shayne Rushton)<br>"
    gCodeWindow.innerHtML += "(Post Process is GRBL_POST)<br>"
    gCodeWindow.innerHTML += "(Begin Preamble)<br>"
    gCodeWindow.innerHTML += "G17 G90<br>" + gUnitValue + "<br>G54<br>"
    gCodeWindow.innerHTML += "M3 S20000<br>"
    gCodeWindow.innerHTML += "G0 Z" + safeTravel.toFixed(3) + " F5000<br>"
    //gCodeWindow.innerHTML += "G0 X" + -(fretboardWidths[0] / 2) + " Y" + yDistances[0] + "<br>"

    yDistances.map((fret, index) => {
        stepDown = -(document.getElementById("stepDown").value)
        zEnd = -(document.getElementById("slotDepth").value)

        zDepth = stepDown
        x1 = -(fretboardWidths[index] / 2)
        x2 = fretboardWidths[index] / 2
        gCodeWindow.innerHTML += "G0 X" + Number(x1).toFixed(3) + " Y" + Number(fret).toFixed(3) +  " F5000 <br>"
        while (zDepth > zEnd){
            gCodeWindow.innerHTML += "G1 X" + Number(x2).toFixed(3) + " Y" + Number(fret).toFixed(3) + " Z" + zDepth.toFixed(3) + " F" + cutSpeed + "<br>"
            if(zDepth + stepDown < zEnd){
                zDepth = zEnd
            } else {
                zDepth += stepDown
            }
            gCodeWindow.innerHTML += "G1 X" + Number(x1).toFixed(3) + " Y" + Number(fret).toFixed(3) + " Z" + zDepth.toFixed(3) + " <br>"
            if(zDepth + stepDown < zEnd){
                zDepth = zEnd
            } else {
                zDepth += stepDown
            }
        }
        gCodeWindow.innerHTML += "G0 Z" + safeTravel.toFixed(3) + " F5000 <br>"
    })

    gCodeWindow.innerHTML += "(Begin Postamble)<br>"
    gCodeWindow.innerHTML += "M5<br>G17 G90<br>M2"

}

    function copyDivToClipboard() {
        var codeWindow = document.getElementById('gCodeWin').innerText
        try {
            navigator.clipboard.writeText(codeWindow)
        } catch (err) {
            console.log(err.message)
        }

    }

function showHide(){
   
   
    const instructionsDiv = document.querySelector("#instructions")

        if(instructionsDiv.className === "closed"){
            instructionsDiv.className = "open"
        } else {
            instructionsDiv.className = "closed"
        }

}


function setFretDistances(firstFret, numFrets, divConstant){

        distances = []
        distances.push(firstFret)
        for(i = 1; i < numFrets; i++){
            nextFret = ((scale - distances[i - 1]) / divConstant + distances[i - 1])
            distances.push(nextFret)
        }

    return distances
}
