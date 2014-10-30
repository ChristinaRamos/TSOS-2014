var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(mem) {
            if (typeof mem === "undefined") { mem = new TSOS.Memory(_MemorySize); }
            this.mem = mem;
        }
        MemoryManager.prototype.init = function () {
            this.displayMem();
        };

        MemoryManager.prototype.displayMem = function () {
            var output = "<tr>";

            for (var i = 0; i < _MemorySize; i++) {
                if (i % 8 === 0) {
                    output += "</tr><tr><td>" + "</td>";
                }
                output += "<td id='cell'" + i + "'>" + this.mem.memArray[i] + '</td>';
            }
            output += "</tr>";
            TSOS.Control.displayMemory(output);
        };
        MemoryManager.prototype.getMem = function (index) {
            return this.mem.memArray[index];
        };

        MemoryManager.prototype.setMem = function (index, value) {
            if (value.length === 1) {
                this.mem.memArray[index] = "0" + value;
                this.displayMem();
            } else {
                this.mem.memArray[index] = value;
                this.displayMem();
            }
        };

        MemoryManager.prototype.nextByte = function () {
            return this.getMem(++_CPU.PC);
        };

        MemoryManager.prototype.nextTwoBytes = function () {
            var nextTwo = "";
            nextTwo = this.getMem(++_CPU.PC) + this.getMem(++_CPU.PC);
            nextTwo = nextTwo.substr(2, 2) + nextTwo.substr(0, 2);
            return nextTwo;
        };

        MemoryManager.prototype.loadProg = function () {
            _CPU.PC = 0;
            var program = TSOS.Control.getProgramInput();
            var substr = "";
            var count = 0;
            for (var i = 0; i < program.length; i += 2) {
                substr = program.substr(i, 2);
                this.setMem(count, substr);
                count++;
            }
            _StdOut.putText("PID is " + _PID + ".");
            _ProgramList[_ProgramList.length] = new TSOS.PCB;
        };

        MemoryManager.prototype.hexToDecimal = function (hexNum) {
            return parseInt(hexNum, 16);
        };

        MemoryManager.prototype.decimalToHex = function (decNum) {
            return decNum.toString(16).toUpperCase();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
