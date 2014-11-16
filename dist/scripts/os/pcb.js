//PCB class
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(pC, acc, xReg, yReg, zFlag, pid, alreadyRan, base, limit) {
            if (typeof pC === "undefined") { pC = 0; }
            if (typeof acc === "undefined") { acc = 0; }
            if (typeof xReg === "undefined") { xReg = 0; }
            if (typeof yReg === "undefined") { yReg = 0; }
            if (typeof zFlag === "undefined") { zFlag = 0; }
            if (typeof pid === "undefined") { pid = 0; }
            if (typeof alreadyRan === "undefined") { alreadyRan = false; }
            if (typeof base === "undefined") { base = 0; }
            if (typeof limit === "undefined") { limit = 0; }
            this.pC = pC;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.pid = pid;
            this.alreadyRan = alreadyRan;
            this.base = base;
            this.limit = limit;
            //Every time a PCB is created, it's a new program
            //so increment dat PID
            this.pid = _PID;
            _PID++;
        }
        PCB.prototype.setBase = function (num) {
            this.base = num;
        };

        PCB.prototype.setLimit = function (num) {
            this.limit = num;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
