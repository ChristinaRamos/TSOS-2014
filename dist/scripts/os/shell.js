///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");

            // date
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date.");

            // where am i
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays your location.");

            // the truth
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellOneTrueBond, "ihatedanielcraig", "Our Lord and Savior Daniel Craig forgives you.");

            // status
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellStatus, "status", "Allows user to put dirty statuses on HostLog.");

            // bsod
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "CAUTION: DO NOT PRESS THIS BUTTON.");

            // load
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellLoad, "load", "Allows user to load code.  It better be hex.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRun, "run", "Allows user to run a program that has been loaded into memory.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "Wipes all blocks of memory.  Clean slate.  New beginnings.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "Allows user to set Round Robin quantum.  Tweet.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.runAll, "runall", "Allows user to run all loaded programs at once.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.ps, "ps", "Allows user to display PIDs of all active processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.kill, "kill", "Allows user to kill an active process.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.setSchedule, "setschedule", "Allows user to set the scheduling type.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.getSchedule, "getschedule", "Allows user to get the scheduling type.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.fileCreate, "create", "Allows user to create a file.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.fileRead, "read", "Allows user to view the contents of a file.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.fileWrite, "write", "Allows user to write contents to a file.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.fileDelete, "delete", "Allows user to remove a file.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.format, "format", "Allows user to format the disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.ls, "ls", "Allows user to list filenames on disk.");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
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
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();

            // ... call the command function passing in the args...
            fn(args);

            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            // ... and finally write the prompt again...or not?
            if (_DrawingContext.fillStyle != "#0000ff") {
                this.putPrompt(); //don't write that goddamn prompt if there's a blue screen of death dammit.
            }
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function () {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };

        Shell.prototype.shellMan = function (args) {
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
        };

        Shell.prototype.shellTrace = function (args) {
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
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellDate = function () {
            var d = new Date();
            _StdOut.putText("The date is " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
            _StdOut.advanceLine();
            if (d.getMinutes() < 10) {
                _StdOut.putText("The time is " + (d.getHours()) + ":0" + d.getMinutes());
            } else
                _StdOut.putText("The time is " + (d.getHours()) + ":" + d.getMinutes());
            if (d.getHours() > 11) {
                _StdOut.putText("PM");
            } else
                _StdOut.putText("AM");
        };

        Shell.prototype.shellWhereAmI = function () {
            _StdOut.putText("Bond, we have your location as approaching an airfield."); //It's a quote from a DANIEL CRAIG Bond movie :D
        };

        Shell.prototype.shellOneTrueBond = function () {
            _StdOut.putText("Our Lord Daniel Craig carries the weight of our sins.");
            window.open("https://www.youtube.com/watch?v=i_y7YEIphts", "", "width=1600, height=900"); //This should make you happy
        };

        Shell.prototype.shellStatus = function (args) {
            TSOS.Control.setInput(args.join(" ")); //args is an array, gotta make it a string and delimit with spaces, not commas!
        };

        Shell.prototype.shellBsod = function () {
            _Kernel.krnTrapError("This is a test BSOD"); //nifty host log text
            _DrawingContext.fillStyle = "blue"; //what a creative color to use for a bsod
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height); //draw a cool rectangle as big as the canvas
        };

        Shell.prototype.shellLoad = function (args) {
            var input = "";
            var isHex = true;

            //all those valid hex characters.  what a bunch of kool kidz
            var hexCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", " "];

            //the stuff in the damn user program box casted because typescript is silly
            //and made lower case because I don't want to check for capitals
            input = TSOS.Control.getProgramInput();

            if (input === "") {
                _StdOut.putText("Have you tried actually typing something?"); //well, have you?
            } else {
                for (var i = 0; i < input.length; i++) {
                    //is the input character at i found in the valid hex characters array?
                    if (hexCharacters.indexOf(input.charAt(i)) === -1) {
                        isHex = false; //no, it's not!
                    }
                }
                if (isHex === false) {
                    _StdOut.putText("This isn't hex.  Are you even trying?"); //well, are you?
                } else {
                    //_StdOut.putText("This is hex.  Fanfuckintastic.");        //I was frustrated by this point...
                    if (input.length % 2 != 0) {
                        _StdOut.putText("This isn't an even number of hex characters.");
                    } else {
                        //Go load the program for realsies.
                        _MemoryManager.loadProg(args[0]);
                    }
                }
            }
        };

        Shell.prototype.shellRun = function (args) {
            if (typeof args[0] === "undefined") {
                _StdOut.putText("PID not provided.");
            } else if (_CPUScheduler.residentList.get(parseInt(args[0])) === false) {
                _StdOut.putText("Incorrect PID.");
            } else {
                _CurrentPID = parseInt(args[0]);

                if (_CPUScheduler.readyQueue.isEmpty() && !_CPU.isExecuting) {
                    _CurrentProgram = _CPUScheduler.residentList.getRemove(_CurrentPID);
                    _CPU.updateCPU();
                    _CPU.isExecuting = true;
                } else
                    _CPUScheduler.readyQueue.enqueue(_CPUScheduler.residentList.getRemove(_CurrentPID));
                // Remove current PID from resident queue and put it in ready queue
                // If current program pcb === null, or if the cpu is NOT executing
                // that means no program is currently running, so dequeue that program
                // from the ready queue and set it to the current pcb
                //_CPU.isExecuting = true;
            }
        };

        Shell.prototype.shellClearMem = function () {
            _MemoryManager.memoryWipe();
            _StdOut.putText("Memory has been cleared.");
            _Console.advanceLine();
        };

        Shell.prototype.shellQuantum = function (args) {
            _QuantumOfSolace = args[0];
            _StdOut.putText("Quantum has been set to " + args[0] + ".");
        };

        Shell.prototype.runAll = function () {
            _CPUScheduler.runAll();
        };

        Shell.prototype.ps = function () {
            _StdOut.putText("Current Program PID: " + _CurrentPID);
            _StdOut.advanceLine();

            _StdOut.putText("Ready Queue PIDs: ");
            for (var i = 0; i < _CPUScheduler.readyQueue.getSize(); i++) {
                _StdOut.putText(_CPUScheduler.readyQueue.q[i].pid + "  ");
            }
        };

        Shell.prototype.kill = function (args) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(KILL_IRQ, args[0]));
        };

        Shell.prototype.setSchedule = function (args) {
            if (_CPU.isExecuting === true) {
                _StdOut.putText("CAN'T LET YOU DO THAT, STAR FOX.");
            } else {
                if (args[0] === "rr") {
                    _Schedule = "rr";
                    _StdOut.putText("Scheduling set to Round Robin.");
                    _StdOut.advanceLine();
                } else if (args[0] === "fcfs") {
                    _Schedule = "fcfs";
                    _StdOut.putText("Scheduling set to First Come First Serve.");
                    _StdOut.advanceLine();
                } else if (args[0] === "priority") {
                    _Schedule = "priority";
                    _StdOut.putText("Scheduling set to Priority.");
                    _StdOut.advanceLine();
                } else
                    _StdOut.putText("Either that isn't a schedule or we don't have that here.");
            }
        };

        Shell.prototype.getSchedule = function () {
            _StdOut.putText("The current schedule is " + _Schedule + ".");
            _StdOut.advanceLine();
        };

        Shell.prototype.fileCreate = function (args) {
            var filename = args[0];

            if (filename === undefined) {
                _StdOut.putText("You didn't fucking type a filename.");
            } else if (_krnFileSystem.stringToHex(filename).length > _krnFileSystem.dataData) {
                _StdOut.putText("Try a shorter fucking filename.");
            } else
                _krnFileSystem.createFile(filename);
        };

        Shell.prototype.fileWrite = function (args) {
            var filename = args[0];
            var data = args[1];

            if (filename === undefined) {
                _StdOut.putText("Filename pls.");
            } else if (data === undefined) {
                _StdOut.putText("Tell me what to write, man.");
            } else if (!(filename in _FileNames)) {
                _StdOut.putText("That filename doesn't exist.");
            } else
                _krnFileSystem.writeFile(filename, data);
        };

        Shell.prototype.fileRead = function (args) {
            var filename = args[0];
            if (filename === undefined) {
                _StdOut.putText("Filename pls.");
            } else if (!(filename in _FileNames)) {
                _StdOut.putText("That filename doesn't exist.");
            } else
                _krnFileSystem.readFile(filename);
        };

        Shell.prototype.fileDelete = function (args) {
            var filename = args[0];
            if (filename === undefined) {
                _StdOut.putText("Give me a filename pls.");
            } else if (!(filename in _FileNames)) {
                _StdOut.putText("This file does not exist.");
            } else
                _krnFileSystem.deleteFile(filename);
        };

        Shell.prototype.format = function () {
            debugger;
            _krnFileSystem.format();
        };

        Shell.prototype.ls = function () {
            debugger;
            _krnFileSystem.ls();
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
