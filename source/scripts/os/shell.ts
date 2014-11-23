///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            // date
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the date.");
            // where am i
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  "- Displays your location.");
            // the truth
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellOneTrueBond,
                                  "ihatedanielcraig",
                                  "Our Lord and Savior Daniel Craig forgives you.");
            // status
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "Allows user to put dirty statuses on HostLog.");
            // bsod
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellBsod,
                                  "bsod",
                                  "CAUTION: DO NOT PRESS THIS BUTTON.");
            // load
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "Allows user to load code.  It better be hex.");

            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "Allows user to run a program that has been loaded into memory.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellClearMem,
                                  "clearmem",
                                  "Wipes all blocks of memory.  Clean slate.  New beginnings.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "Allows user to set Round Robin quantum.  Tweet.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.runAll,
                                  "runall",
                                  "Allows user to run all loaded programs at once.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.ps,
                                  "ps",
                                  "Allows user to display PIDs of all active processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.kill,
                                  "kill",
                                  "Allows user to kill an active process.");


            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
            userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again...or not?
            if(_DrawingContext.fillStyle != "#0000ff"){    
                this.putPrompt();           //don't write that goddamn prompt if there's a blue screen of death dammit.
            }
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer() {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate() {
            var d = new Date();
            _StdOut.putText("The date is " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
            _StdOut.advanceLine()
            if(d.getMinutes() < 10){        //If the minutes are single digit, add a 0 so it doesn't look dumb as hell
                _StdOut.putText("The time is " + (d.getHours()) + ":0" + d.getMinutes());
            }
            else
                _StdOut.putText("The time is " + (d.getHours()) + ":" + d.getMinutes());
            if(d.getHours() > 11){          //Military time because I'm SO edgy guys
                _StdOut.putText("PM");
            }
            else
                _StdOut.putText("AM");

        }

        public shellWhereAmI() {
            _StdOut.putText("Bond, we have your location as approaching an airfield."); //It's a quote from a DANIEL CRAIG Bond movie :D
        }

        public shellOneTrueBond() {
            _StdOut.putText("Our Lord Daniel Craig carries the weight of our sins.")  //Praise Craigus
            window.open("https://www.youtube.com/watch?v=i_y7YEIphts", "", "width=1600, height=900");  //This should make you happy
        }

        public shellStatus(args) {
            Control.setInput(args.join(" "));    //args is an array, gotta make it a string and delimit with spaces, not commas!
        }

        public shellBsod() {
            _Kernel.krnTrapError("This is a test BSOD");          //nifty host log text
            _DrawingContext.fillStyle = "blue";                   //what a creative color to use for a bsod
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);      //draw a cool rectangle as big as the canvas
        }

        public shellLoad() {
            var input = "";
            var isHex = true;
            //all those valid hex characters.  what a bunch of kool kidz
            var hexCharacters = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"," "];
            //the stuff in the damn user program box casted because typescript is silly
            //and made lower case because I don't want to check for capitals
            input = Control.getProgramInput();
           
            if(input === ""){
                _StdOut.putText("Have you tried actually typing something?");   //well, have you?
            }

            else {
                for (var i = 0; i < input.length; i++){
                    //is the input character at i found in the valid hex characters array?
                    if (hexCharacters.indexOf(input.charAt(i)) === -1){         
                        isHex = false;   //no, it's not!                                       
                    }
                }
                if(isHex === false){
                   _StdOut.putText("This isn't hex.  Are you even trying?");    //well, are you?
                }
                else {  
                    //_StdOut.putText("This is hex.  Fanfuckintastic.");        //I was frustrated by this point...
                    if(input.length % 2 != 0) {
                        _StdOut.putText("This isn't an even number of hex characters.");
                    }

                    else {                  
                    //Go load the program for realsies.
                        _MemoryManager.loadProg();
                    }
                }

            }
        }

        public shellRun(args) {
            if(typeof args[0] === "undefined") {
                _StdOut.putText("PID not provided.");
            }
            else if (_CPUScheduler.residentList.get(parseInt(args[0])) === false){
                _StdOut.putText("Incorrect PID.");
            }
            else {
                _CurrentPID = parseInt(args[0]);

                if(_CPUScheduler.readyQueue.isEmpty() && !_CPU.isExecuting) {
                    _CurrentProgram = _CPUScheduler.residentList.getRemove(_CurrentPID);
                    _CPU.updateCPU();
                    _CPU.isExecuting = true;
                }
                else
                    _CPUScheduler.readyQueue.enqueue(_CPUScheduler.residentList.getRemove(_CurrentPID));
                

                // Remove current PID from resident queue and put it in ready queue
                // If current program pcb === null, or if the cpu is NOT executing
                // that means no program is currently running, so dequeue that program
                // from the ready queue and set it to the current pcb
                //_CPU.isExecuting = true;
                
            }
        }

        public shellClearMem() {
            _MemoryManager.memoryWipe();
            _StdOut.putText("Memory has been cleared.");
            _Console.advanceLine();
        }

        public shellQuantum(args): void {
            _QuantumOfSolace = args[0];
            _StdOut.putText("Quantum has been set to " + args[0] + ".");
        }

        public runAll(): void {
            _CPUScheduler.runAll();
        }

        public ps(): void {

        }

        public kill(): void {

        }
    }
}
