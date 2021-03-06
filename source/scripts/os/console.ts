///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public fSize = [],      //keeps track of the font size of the previous letter for backspacey purposes
                    public history = [],    //keeps track of what's been entered into console for up/down history purposes
                    public count = 0,       //what a specific variable name!  helps get the end of the array without popping
                    public buffer = "") {   //why am I commenting this...it was already here

        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //better add what's in the buffer to our history array before it gets spirited away!
                    this.history.push(this.buffer);     
                    // ... and reset our buffer.
                    this.buffer = "";
                    //reset count back to 0 every time we type a new command to add to history
                    this.count = 0;

                    //backspace key.  no waaaaaaaaaaaaaay!
                } else if (chr === String.fromCharCode(8)) {
                    //you'll never guess what this does    
                    this.backspace();   
                    //had issue with ampersand, so had to change it up here                        
                } else if (chr === "upArrow") {         
                    //yay no magic numbers!  position after prompt        
                    this.currentXPosition = STARTING_X_POS; 
                    //clear buffer    
                    this.buffer = "";    
                    //clear what's been written after the prompt                       
                    _DrawingContext.fillStyle = "#DFDBC3";
                    _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, 500, _DefaultFontSize + 
                                         _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                         _FontHeightMargin);
                    //draw the previous command onto canvas
                    this.putText(this.history[this.history.length - this.count - 1]);
                    //add it to the buffer so it isn't just a pretty, meaningless drawing
                    this.buffer += this.history[this.history.length - this.count - 1];
                    //stop cycling through history once we reach the first command ever
                    if(this.count < this.history.length - 1){
                        this.count++;
                    }
                    //this time, left parenthesis decided to be an ass instead of ampersand.  oh boy.
                } else if (chr === "downArrow") {
                    //don't go below zero or we all actually die.  WE ACTUALLY DIE.
                    if(this.count > 0){
                        this.count--;
                    }                 
                    //set ourselves up at the position right after the prompt.  no eating the prompt, kids.
                    this.currentXPosition = STARTING_X_POS;
                    //clear dat buffa
                    this.buffer = "";
                    //erase that crap from the canvas
                    _DrawingContext.fillStyle = "#DFDBC3";
                    _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, 500, _DefaultFontSize + 
                                         _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                         _FontHeightMargin);
                    //draw command onto canvas and add to buffer.  come on, you've seen this before.
                    this.putText(this.history[this.history.length - this.count - 1]);
                    this.buffer += this.history[this.history.length - this.count - 1];
                } else if (chr === String.fromCharCode(9)) {
                    //hey, can you pick up the...
                    this.tab();
                    //heh, get it?
                }               
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                  }
                // TODO: Write a case for Ctrl-C.
            }
        }
        

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                if(this.currentXPosition > _Canvas.width) {
                    this.advanceLine(); 
                    this.currentXPosition = STARTING_X_POS;
                    _LineWrapped = true;  
                }
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                


                //add the font size to our font size array.  how exciting.
                this.fSize.push(offset);
                //Measure the last letter drawn so that we can backspace it if needed
                this.currentXPosition = this.currentXPosition + offset;
            }

         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (Project 1)
            //more like, toDONE amirite?!
            //please don't leave
            //if we have reached the bottom of the page...canvas...thing
            if (this.currentYPosition >= _Canvas.height){
                //pictures, pictures of spida-man.  and our canvas.
                var imgData = _DrawingContext.getImageData(0,0,_Canvas.width,_Canvas.height);
                //clear screen and draw dat canvas back except higher than before.
                this.clearScreen();
                _DrawingContext.putImageData(imgData,0, -(_DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin));
                this.currentYPosition -= (_DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin);
            }         
        }
        //totally unrelated but I'm listening to this as I write comments and it's awesome if you like electronic music
        //https://www.youtube.com/watch?v=xUVmvqwyAeg
        public backspace(): void {
            //we gotta use this thing twice which means we can't pop it twice because REMOVALS so here's a var
            var fSizePop = this.fSize.pop();
            //Had to round to the nearest single decimal place because otherwise
            //I got 12.47999999999... which wouldn't allow me to backspace my first character after prompt
            //basically we're trying to not eat the prompt with backspace and also not backspace too little
            if (Math.round((this.currentXPosition - fSizePop) * 10 ) / 10 >= STARTING_X_POS){
                //put ourselves at x position 1 character backwards.  almost like a real backspace, WHOA.
                this.currentXPosition = this.currentXPosition - fSizePop;
                //cover that ugly, unwanted letter with a rectangle of the canvas's color omg so racist
                _DrawingContext.fillStyle = "#DFDBC3";
                _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, fSizePop, _DefaultFontSize + 
                                         _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                         _FontHeightMargin);
                //get rid of that unwanted character from the buffer
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
            }

            else {
                if(_LineWrapped === true) {
                    this.currentYPosition -= _DefaultFontSize + 
                                             _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                             _FontHeightMargin;
                    this.currentXPosition = _Canvas.width;
                    //put ourselves at x position 1 character backwards.  almost like a real backspace, WHOA.
                    this.currentXPosition = this.currentXPosition - fSizePop;
                    //cover that ugly, unwanted letter with a rectangle of the canvas's color omg so racist
                    _DrawingContext.fillStyle = "#DFDBC3";
                    _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, fSizePop, _DefaultFontSize + 
                                             _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                             _FontHeightMargin);
                    //get rid of that unwanted character from the buffer
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                }
            }
        }

        public tab(): void {
            //keeps track of whether a prefix has multiple commands it can autocomplete into
            var prefixCount = 0
            //make sure that something has been typed so we don't get a giant mother list
            //of all commands for no reason
            if(this.buffer != "") {


                //first let's see if a prefix DOES have multiple commands it can be
                //they told that prefix it could be anything, so it became Documents, Downloads, AND Desktop!
                for (var i = 0; i < _OsShell.commandList.length; i++){
                    if(_OsShell.commandList[i].command.indexOf(this.buffer) == 0) {
                        prefixCount++;
                    }
                } 
                //if this prefix is unique and can only be one thing (how sad and oppressive)
                //this whole block just wipes the buffer and the command line and puts the whole command there for you!
                //it of course then updates the buffer.  a picture may be a thousand words but a buffer is...well
                //however many you want, man           
                if(prefixCount <= 1){
                    for (var i = 0; i < _OsShell.commandList.length; i++){
                        if(_OsShell.commandList[i].command.indexOf(this.buffer) == 0) {
                            this.buffer = "";
                            this.currentXPosition = STARTING_X_POS;
                            _DrawingContext.fillStyle = "#DFDBC3";
                            _DrawingContext.fillRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, 500, _DefaultFontSize + 
                                                 _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                                 _FontHeightMargin);
                            this.putText(_OsShell.commandList[i].command);
                            this.buffer += _OsShell.commandList[i].command;
                        }
                    }
                }
                //otherwise, we display the possibilities and the user can then just backspace or enter out
                //and then be more fuckin specific next time.  COME ON USER, STOP MESSING AROUND.
                else {
                    _StdOut.advanceLine();
                    for (var i = 0; i < _OsShell.commandList.length; i++){
                            if(_OsShell.commandList[i].command.indexOf(this.buffer) == 0) {
                                _StdOut.putText(_OsShell.commandList[i].command + "    ");
                            }       
                    }
                    //after showing the user the possibilities, put the user on the next line
                    //and write the part of the word that they already wrote before
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    this.putText(this.buffer);
                }
            } 
        }

        public sysCall(): void {
            //debugger;
            if(_CPU.Xreg === 1) {
                this.putText(_CPU.Yreg.toString());
                this.advanceLine();
                _OsShell.putPrompt();
            }

            else if(_CPU.Xreg === 2) {
                var termString = "";
                var position = _CPU.Yreg + _CurrentProgram.base;
                var stringPart = _MemoryManager.getMem(position)
                while(stringPart !== "00") {
                    termString += String.fromCharCode(_MemoryManager.hexToDecimal(stringPart));
                    stringPart = _MemoryManager.getMem(++position);
                }
                this.putText(termString);
                this.advanceLine();
                _OsShell.putPrompt();
            }
        }
    }
}
