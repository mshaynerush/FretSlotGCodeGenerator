function fretsTest() {



    // Set values for x widths and y distances
    // Get value of first fret based on scale length
    // Use firstFret value to generate the distance to each fret from the nut

    scale = parseFloat(document.getElementById("scale").value)
    divConstant = 17.817
    numFret = parseFloat(document.getElementById("numFrets").value)
    cutSpeed = parseFloat(document.getElementById("cutSpeed").value)
    bitDiameter = parseFloat(document.getElementById("bitDiameter"))
    firstFret = scale / divConstant
    yDistances = []

    yDistances.push(firstFret)
   
    for(i = 1; i < numFrets; i++){
        nextFret = ((scale - yDistances[i - 1]) / divConstant + yDistances[i - 1])
        

        // If user is using inches, change inch values to mm
        if(document.querySelector("#inch").checked = true){
            nextFret = nextFret * 25.4
            
        }


        yDistances.push(nextFret)
    }
    
    // get widths of the fretboard at each ydistance
    base1 = document.getElementById("lastFretWidth").value
    base2 = document.getElementById("nutWidth").value
    fretboardWidths = []


    
    yDistances.map(fret => {
        totalLength = yDistances[numFrets - 1]
        // to simplify the linear equation each part of the equation is figured separately then added together

      
        fretWidthReduction = bitDiameter * 2.5        
        currentFretWidth = ((fret/totalLength) * base1) + ((totalLength - fret)/totalLength) * base2 - fretWidthReduction

        // if user is using inches change fret width to mm
        if(document.querySelector('#inch').checked = true){

           currentFretWidth = (((fret/totalLength) * base1) + ((totalLength - fret)/totalLength) * base2 - fretWidthReduction) * 25.4
           
        }
        

        fretboardWidths.push(currentFretWidth)
    })
 

    createGCode(yDistances, fretboardWidths)

}



function createGCode(yDistances, fretBoardWidths){



    // get window to retun G Code to
    gCodeWindow = document.getElementById("gCodeWin")

    // set unit code for CNC Movement
    if(document.querySelector('#inch').checked = true){
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

        if(document.querySelector('#inch').checked = true) {
            stepDown = stepDown * 25.4
        }

        zDepth = stepDown

        zEnd = parseFloat(-(document.getElementById("slotDepth").value))
        x1 = -(fretboardWidths[index] / 2)
        x2 = fretBoardWidths[index] / 2
        gCodeWindow.innerHTML += "G0 X" + x1.toFixed(3) + " Y" + fret +  " F5000 <br>"
        while (zDepth > zEnd){
            gCodeWindow.innerHTML += "G1 X" + x2.toFixed(3) + " Y" + fret + " Z" + zDepth.toFixed(3) + " F" + cutSpeed + " <br>"
            if(zDepth + stepDown < zEnd){
                zDepth = zEnd
            } else {
                zDepth += stepDown
            }
            gCodeWindow.innerHTML += "G1 X" + x1.toFixed(3) + " Y" + fret + " Z" + zDepth.toFixed(3) + " <br>"
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