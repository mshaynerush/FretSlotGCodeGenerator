const menuButton = document.querySelector("#menuButton")
menuButton.addEventListener('click', showHide())

function fretsTest() {



    // Set values for x widths and y distances
    // Get value of first fret based on scale length
    // Use firstFret value to generate the distance to each fret from the nut

    console.log("Start version 2 <- version 1 reset 5.4")
    scale = document.getElementById("scale").value
    divConstant = 17.817
    numFrets = document.getElementById("numFrets").value
    bitDiameter = document.getElementById("bitDiameter").value
    firstFret = scale / divConstant
    firstFret = Number(firstFret.toFixed(3))
    yDistances = []

    yDistances.push(firstFret)
   
    for(i = 1; i < numFrets; i++){
        nextFret = ((scale - yDistances[i - 1]) / divConstant + yDistances[i - 1])
        nextFret = Number(nextFret.toFixed(3))
        yDistances.push(Number(nextFret.toFixed(3)))
    }
    
    // get widths of the fretboard at each ydistance
    base1 = document.getElementById("lastFretWidth").value
    base2 = document.getElementById("nutWidth").value
    fretboardWidths = []


    
    yDistances.map(fret => {
        totalLength = yDistances[numFrets - 1]
        // to simplify the linear equation each part of the equation is figured separately then added together

        if(document.querySelector('input[name="unit"]:checked').id === "inch"){
            fretWidthReduction = inchConversion(bitDiameter)
        } else {
            fretWidthReduction = 2 + (bitDiameter)
        }
        currentFretWidth = ((fret/totalLength) * base1) + ((totalLength - fret)/totalLength) * base2 - fretWidthReduction
        fretboardWidths.push(Number(currentFretWidth.toFixed(3)))
    })
 
        if(document.querySelector('input[name="unit"]:checked').id === "inch"){
            yInchToMM = yDistances.map(distance => Number(distance * 25.4).toFixed(3))
            xInchToMM = fretboardWidths.map(width => Number(width * 25.4).toFixed(3))
            createGCode(yInchToMM, xInchToMM)
        } else {
            createGCode(yDistances, fretboardWidths)
        }

    

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

    // set unit code for CNC Movement
    if(document.querySelector('input[name="unit"]:checked').id === "inch"){
        unitCode = "G20"
        safeTravel = 3.000 / 25.400
    } else {
        unitCode = "G21"
        safeTravel = 3.000
    }

    gCodeWindow.innerHTML = "(Created by Shayne Rushton)<br>"
    gCodeWindow.innerHtML += "(Post Process is GRBL_POST)<br>"
    gCodeWindow.innerHTML += "(Begin Preamble)<br>"
    gCodeWindow.innerHTML += "G17 G90<br>" + unitCode + "<br>G54<br>"
    gCodeWindow.innerHTML += "M3 S20000<br>"
    gCodeWindow.innerHTML += "G0 Z" + safeTravel.toFixed(3) + " F5000<br>"
    //gCodeWindow.innerHTML += "G0 X" + -(fretboardWidths[0] / 2) + " Y" + yDistances[0] + "<br>"

    yDistances.map((fret, index) => {
        stepDown = -(document.getElementById("stepDown").value)
        zEnd = -(document.getElementById("slotDepth").value)
        if(document.querySelector('input[name="unit"]:checked').id === "inch"){
            stepDown *= 25.4
            zEnd *= 25.4
        }

        zDepth = stepDown
        x1 = -(fretboardWidths[index] / 2)
        x2 = fretboardWidths[index] / 2
        gCodeWindow.innerHTML += "G0 X" + x1 + " Y" + fret +  " F5000 <br>"
        while (zDepth > zEnd){
            gCodeWindow.innerHTML += "G1 X" + x2 + " Y" + fret + " Z" + zDepth.toFixed(3) + " F" + cutSpeed + "<br>"
            if(zDepth + stepDown < zEnd){
                zDepth = zEnd
            } else {
                zDepth += stepDown
            }
            gCodeWindow.innerHTML += "G1 X" + x1 + " Y" + fret + " Z" + zDepth.toFixed(3) + " <br>"
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

