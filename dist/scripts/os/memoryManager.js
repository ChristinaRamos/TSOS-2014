var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(mem) {
            if (typeof mem === "undefined") { mem = new TSOS.Memory(_MemorySize); }
            this.mem = mem;
            //It's just a stupid array.
        }
        MemoryManager.prototype.init = function () {
            this.displayMem();
        };

        MemoryManager.prototype.displayMem = function () {
            //Feed it HTML so it doesn't eat us instead
            //Start with a table row
            var output = "<tr>";

            for (var i = 0; i < _MemorySize; i++) {
                //Every 8, conclude this row and add another one
                if (i % 8 === 0) {
                    //We need some nice 0xblah hex stuff on the side because it's nice.
                    output += "</tr><tr><td><b>" + "0x" + this.decimalToHex(i) + "</b></td>";
                }

                //This line highlights where the PC is in memory as it executes.  Nifty, eh?
                if (i === _CPU.PC) {
                    output += "<td id='cell' bgcolor='#FFB585'" + i + "'>" + this.mem.memArray[i] + '</td>';
                } else
                    output += "<td id='cell'" + i + "'>" + this.mem.memArray[i] + '</td>';
            }

            //conclude the last row
            output += "</tr>";

            //Send it over to control tower to do html magic.
            TSOS.Control.displayMemory(output);
        };

        MemoryManager.prototype.getMem = function (index) {
            //Gets the memory value at the specified index.
            return this.mem.memArray[index];
        };

        MemoryManager.prototype.setMem = function (index, value) {
            //Don't exceed memory's limit or we all die.
            if (index > _MemorySize) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_EXCEEDED_IRQ, null));
            }

            //Add a leading 0 if the value is only 1 digit.  Otherwise, it looks freakin' weird.
            if (value.length === 1) {
                this.mem.memArray[index] = "0" + value;
                this.displayMem();
            } else {
                this.mem.memArray[index] = value;
                this.displayMem();
            }
        };

        MemoryManager.prototype.nextByte = function () {
            //Get the value of the next byte of memory
            return this.getMem(++_CPU.PC);
        };

        MemoryManager.prototype.nextTwoBytes = function () {
            //Get the value of the next two bytes and swap the endianness
            var nextTwo = "";
            nextTwo = this.getMem(++_CPU.PC) + this.getMem(++_CPU.PC);
            nextTwo = nextTwo.substr(2, 2) + nextTwo.substr(0, 2);
            return nextTwo;
        };

        MemoryManager.prototype.loadProg = function () {
            //Set the PC to the correct block in memory
            this.nextBlock = this.nextEmptyBlock();

            //Assign a PCB to the program
            _CPUScheduler.loadProg(new TSOS.PCB());
            var residentSize = _CPUScheduler.residentList.getSize();

            //set base to next empty block
            _CPUScheduler.residentList.setBase(residentSize - 1, this.nextBlock);

            //set limit to next empty block's end point
            _CPUScheduler.residentList.setLimit(residentSize - 1, this.nextBlock + 255);

            //Get the whole string of input from user program input box
            var program = TSOS.Control.getProgramInput();
            var substr = "";
            var count = this.nextBlock;

            for (var i = 0; i < program.length; i += 2) {
                //Set each cell in memory to the pairs of hex things
                substr = program.substr(i, 2);
                this.setMem(count, substr);
                count++;
            }

            //Announce the PID to console.
            _StdOut.putText("PID is " + (_PID - 1) + ".");
        };

        MemoryManager.prototype.hexToDecimal = function (hexNum) {
            //Convert a hex string, most likely memory, to a decimal number
            return parseInt(hexNum, 16);
        };

        MemoryManager.prototype.decimalToHex = function (decNum) {
            //Convert a decimal number to a hex string and uppercase it
            //Lower case hex looks stupid.
            return decNum.toString(16).toUpperCase();
        };

        MemoryManager.prototype.memoryWipe = function () {
            _CPU.isExecuting = false;
            _CPUScheduler.residentList = new TSOS.Queue();
            this.mem.init();
            this.displayMem();
        };

        MemoryManager.prototype.nextEmptyBlock = function () {
            var firstBlock = 0;
            var secondBlock = 256;
            var thirdBlock = 512;

            if (this.getMem(firstBlock) === "00") {
                return firstBlock;
            } else if (this.getMem(secondBlock) === "00") {
                return secondBlock;
            } else if (this.getMem(thirdBlock) === "00") {
                return thirdBlock;
            } else
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEMORY_EXCEEDED_IRQ, null));
            return;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
