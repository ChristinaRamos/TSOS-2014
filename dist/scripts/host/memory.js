/**
* Simulation of computer memory.
* Disclaimer: I have no idea what I'm doing.
* Brace for impact.
* It's an array of goddamn strings of length 2.  THAT'S ALL IT IS.
*/
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(memArray) {
            this.memArray = memArray;
            this.memArray = new Array(_MemorySize);
            this.init();
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
