///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) && !isShifted ||   // digits
                        (keyCode == 32)                                   ||   // space
                        (keyCode == 8)                                    ||
                        (keyCode == 38)                                   ||
                        (keyCode == 40)                                   ||
                        (keyCode == 13)) {                                     // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else {
                if(isShifted){
                    switch(keyCode) {
                        case 192: chr = "~";
                        break;

                        case 48: chr = ")";
                        break;

                        case 49: chr = "!";
                        break;

                        case 50: chr = "@";
                        break;

                        case 51: chr = "#";
                        break;

                        case 52: chr = "$";
                        break;

                        case 53: chr = "%";
                        break;

                        case 54: chr = "^";
                        break;

                        case 55: chr = "&";
                        break;

                        case 56: chr = "*";
                        break;

                        case 57: chr = "(";
                        break;

                        case 58: chr = ")";
                        break;

                        case 189: chr = "_";
                        break;

                        case 187: chr = "+";
                        break;

                        case 219: chr = "{";
                        break;

                        case 221: chr = "}";
                        break;

                        case 220: chr = "|";
                        break;

                        case 186: chr = ":";
                        break;

                        case 222: chr = "\"";
                        break;

                        case 188: chr = "<";
                        break;

                        case 190: chr = ">";
                        break;

                        case 191: chr = "?";
                        break;

                        //I don't need no goddamn default case.
                        }
                _KernelInputQueue.enqueue(chr);
                }

                else {
                    switch(keyCode) {
                            case 192: chr = "`";
                            break;

                            case 189: chr = "-";
                            break;

                            case 187: chr = "=";
                            break;

                            case 219: chr = "[";
                            break;

                            case 221: chr = "]";
                            break;

                            case 220: chr = "\\";
                            break;

                            case 186: chr = ";";
                            break;

                            case 222: chr = "'";
                            break;

                            case 188: chr = ",";
                            break;

                            case 190: chr = ".";
                            break;

                            case 191: chr = "/";
                            break;

                    }
                _KernelInputQueue.enqueue(chr);
                }
            }
        }
    }
}
