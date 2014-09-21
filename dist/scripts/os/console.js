///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, fSize, history, count, buffer) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof fSize === "undefined") { fSize = []; }
            if (typeof history === "undefined") { history = []; }
            if (typeof count === "undefined") { count = 0; }
            if (typeof buffer === "undefined") { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.fSize = fSize;
            this.history = history;
            this.count = count;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.history.push(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                    this.count = 0;
                } else if (chr === String.fromCharCode(8)) {
                    this.backspace();
                } else if (chr === String.fromCharCode(38)) {
                    this.currentXPosition = 12.48;
                    this.buffer = "";
                    _DrawingContext.fillStyle = "#DFDBC3";
                    _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, 500, _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin);
                    this.putText(this.history[this.history.length - this.count - 1]);
                    this.buffer += this.history[this.history.length - this.count - 1];
                    if (this.count < this.history.length - 1) {
                        this.count++;
                    }
                } else if (chr === String.fromCharCode(40)) {
                    if (this.count > 0) {
                        this.count--;
                    }
                    this.currentXPosition = 12.48;
                    this.buffer = "";
                    _DrawingContext.fillStyle = "#DFDBC3";
                    _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, 500, _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin);
                    this.putText(this.history[this.count]);
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);

                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);

                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);

                //Measure the last letter drawn so that we can backspace it if needed
                this.fSize.push(offset);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };

        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;

            /*
            * Font size measures from the baseline to the highest point in the font.
            * Font descent measures from the baseline to the lowest point in the font.
            * Font height margin is extra spacing between the lines.
            */
            this.currentYPosition += _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            // TODO: Handle scrolling. (Project 1)
        };

        Console.prototype.scroll = function () {
        };

        Console.prototype.backspace = function () {
            if (this.fSize.length != 1) {
                var fSizePop = this.fSize.pop();
                this.currentXPosition = this.currentXPosition - fSizePop;
                _DrawingContext.fillStyle = "#DFDBC3";
                _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, fSizePop, _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin);
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
