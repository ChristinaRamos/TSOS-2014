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
                    output += "</tr><tr><td>" + "bitch" + "</td>";
                }
                output += "<td id='fuck'" + i + "'>" + this.mem.memArray[i] + '</td>';
            }
            output += "</tr>";
            TSOS.Control.displayMemory(output);
        };
        MemoryManager.prototype.getMem = function (index) {
            return this.mem.memArray[index];
        };

        MemoryManager.prototype.setMem = function (index, value) {
            this.mem.memArray[index] = value;
        };

        MemoryManager.prototype.nextByte = function () {
            return this.mem.memArray[++_CPU.PC];
        };

        MemoryManager.prototype.loadProg = function () {
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
