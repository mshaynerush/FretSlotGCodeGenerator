# FretSlotGCodeGenerator

With the Fret Slot G Code generator, those with a CNC and a desire to build guitars can bypass the fret slot process in programs like FreeCAD.

FreeCAD hass issues with memory leaks or something. While it is a great open source free to use program to make some parts, I find that after only a couple CAM workbench jobs, the system freezes and crashes.

With Fusion360, heaven forbid creating an image in inkscape or other graphics illustrators and importing without having to scale and getting it wrong.

With this generator, enter the scale length in inches or millimeters, choose the depth for the slot, enter the width of the fretboard at the first and last fret and choose your stepdown for each pass. 

Generate the G Code, copy and paste it into a plain text editor, give it name and save it with the .nc extension and the gCode will create perfect G Code to cut your fret slots to the desired depth.

This tool expects a .6mm tool for cutting fret slots. Future iterations will allow you to choose the size of your bit, but .6mm makes a good slot for the standard fret.



