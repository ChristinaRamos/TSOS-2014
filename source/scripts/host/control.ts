///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // Get a global reference to the canvas.  TODO: Move this stuff into a Display Device Driver, maybe?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext('2d');

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core.
            if (typeof Glados === "function") {
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();
            _CPU.init();

            _MemoryManager = new MemoryManager();
            _MemoryManager.init();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();

            _CPUScheduler = new CPUScheduler();

            this.displayDingle();

            this.slideBackground();
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static setDate(dateStr): void {
            document.getElementById("date").innerHTML = dateStr;    //sets date for use in shell.ts-shell.Date
        }

        public static setTime(timeStr): void {
            document.getElementById("clock").innerHTML = timeStr;   //sets time for use in shell.ts-shellTime

        }

        public static setInput(input): void {
            document.getElementById("status").innerHTML = input;    //sets input for use in shell.ts-shellStatus
        }

        public static displayMemory(memory): void {
            document.getElementById("memTable").innerHTML = memory;   //displays memory.  Surprise.
        }

        public static getProgramInput(): string {
            //Get the crap from the user program input box and rip the spaces out of its body
            //leaving gaping holes where hope used to be
            return (<HTMLInputElement>document.getElementById("taProgramInput")).value.replace(/\s/g, '').toUpperCase();    //sets input for use in shell.ts-shellStatus
        }

        public static slideBackground(): void {
            //Max x position of background
            var percent = 330;
            var bodyStyle = document.getElementById("body").style;
             bodyStyle.backgroundImage = "url('http://i.imgur.com/GeCLCIB.jpg')";
            var interval = window.setInterval(function(){
                //Move our lovely image of our lord and savior Daniel Craig over by 1% every 1/10 second
                percent--;
                var percentstr = percent + "%";
                bodyStyle.backgroundPosition = percentstr;
                if (percent==200)
                    window.clearInterval(interval);
        },100);
  

        }

        public static displayPCB(output): void {
            //Self explanatory
            document.getElementById("pcbTable").innerHTML = output;

        }

        public static displayCPU(output): void {
            //Self explanatory
            document.getElementById("cpuTable").innerHTML = output;               
        }

        public static kill(pidparam): void {
            var pid = parseInt(pidparam);
            if(pid === _CurrentPID) {
                _CurrentProgram.state = "Killed";
                _StdOut.putText("Program " + _CurrentPID + " successfully killed.");
                _StdOut.advanceLine();
                _CPUScheduler.schedule();
            }

            else {
                for(var i = 0; i < _CPUScheduler.readyQueue.getSize(); i++) {
                    if(pid === _CPUScheduler.readyQueue.get(i).pid) {
                        _MemoryManager.memoryWipeOneBlock(_CPUScheduler.readyQueue.get(i));
                        _CPUScheduler.readyQueue.getRemove(i);
                        _StdOut.putText("Program " + i + " successfully removed.");
                        _StdOut.advanceLine();
                    }
                }
            }
        }

        public static displayDingle(): void {
             
            var output = "";
            var dataStr = "";
            var metaStr = "";
            var tsbStr = "";

            for (var t = 0; t < _krnFileSystem.track; t++) {
                for (var s = 0; s < _krnFileSystem.sector; s++) {
                    for (var b = 0; b < _krnFileSystem.block; b++) {
                        tsbStr = t.toString() + s.toString() + b.toString(); 
                        dataStr = _krnFileSystem.getData(tsbStr);
                        metaStr = _krnFileSystem.getMeta(tsbStr);

                        output+="<tr><td>"+t+":"+s+":"+b+"</td>";
                        output+="<td>"+ metaStr.substring(0, 4) +"</td>";
                        output+="<td>"+ dataStr +"</td></tr>";
                    }
                }
            }

            document.getElementById("FileDisplay").innerHTML = output;
        }
    }
}
