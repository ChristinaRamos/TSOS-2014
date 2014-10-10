/**
* Simulation of computer memory.
* Disclaimer: I have no idea what I'm doing.
* Brace for impact.
*/
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(memArray) {
            if (typeof memArray === "undefined") { memArray = [256]; }
            this.memArray = memArray;
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < this.memArray.length; i++) {
                this.memArray[i] = 00;
            }
        };

        Memory.prototype.getMem = function (index) {
            return this.memArray[index];
        };

        Memory.prototype.setMem = function (index, value) {
            this.memArray[index] = value;
        };

        Memory.prototype.isByte = function (index) {
            return this.memArray[index] >= 0 && this.memArray[index] <= 255;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
