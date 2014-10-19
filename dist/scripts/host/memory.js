/**
* Simulation of computer memory.
* Disclaimer: I have no idea what I'm doing.
* Brace for impact.
*/
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(memArray) {
            if (typeof memArray === "undefined") { memArray = new Array(_MemorySize); }
            this.memArray = memArray;
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < _MemorySize; i++) {
                this.memArray[i] = "00";
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
