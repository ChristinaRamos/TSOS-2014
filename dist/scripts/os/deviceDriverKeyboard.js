///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);

                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if ((!isShifted && (keyCode >= 48) && (keyCode <= 57)) || (keyCode == 32) || (keyCode == 8) || (keyCode == 9) || (keyCode == 13)) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
                //had issue with ampersand, so had to name upArrow and downArrow instead
                //of just using their keycodes
            } else if (keyCode == 38 && !isShifted) {
                chr = "upArrow";
                _KernelInputQueue.enqueue(chr);
            } else if (keyCode == 40 && !isShifted) {
                chr = "downArrow";
                _KernelInputQueue.enqueue(chr);
            } else {
                //buncha keycodes man
                if (isShifted) {
                    switch (keyCode) {
                        case 192:
                            chr = "~";
                            break;

                        case 48:
                            chr = ")";
                            break;

                        case 49:
                            chr = "!";
                            break;

                        case 50:
                            chr = "@";
                            break;

                        case 51:
                            chr = "#";
                            break;

                        case 52:
                            chr = "$";
                            break;

                        case 53:
                            chr = "%";
                            break;

                        case 54:
                            chr = "^";
                            break;

                        case 55:
                            chr = "&";
                            break;

                        case 56:
                            chr = "*";
                            break;

                        case 57:
                            chr = "(";
                            break;

                        case 189:
                            chr = "_";
                            break;

                        case 187:
                            chr = "+";
                            break;

                        case 219:
                            chr = "{";
                            break;

                        case 221:
                            chr = "}";
                            break;

                        case 220:
                            chr = "|";
                            break;

                        case 186:
                            chr = ":";
                            break;

                        case 222:
                            chr = "\""; //IT BOTHERS ME SO MUCH THAT THIS IS PURPLE IN SUBLIME TEXT
                            break;

                        case 188:
                            chr = "<";
                            break;

                        case 190:
                            chr = ">";
                            break;

                        case 191:
                            chr = "?";
                            break;
                    }
                    _KernelInputQueue.enqueue(chr);
                } else {
                    switch (keyCode) {
                        case 192:
                            chr = "`";
                            break;

                        case 189:
                            chr = "-";
                            break;

                        case 187:
                            chr = "=";
                            break;

                        case 219:
                            chr = "[";
                            break;

                        case 221:
                            chr = "]";
                            break;

                        case 220:
                            chr = "\\"; //AHHGH THIS IS PURPLE TOO
                            break;

                        case 186:
                            chr = ";";
                            break;

                        case 222:
                            chr = "'";
                            break;

                        case 188:
                            chr = ",";
                            break;

                        case 190:
                            chr = ".";
                            break;

                        case 191:
                            chr = "/";
                            break;
                    }
                    _KernelInputQueue.enqueue(chr);
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
