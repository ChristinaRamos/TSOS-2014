var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(pC, acc, xReg, yReg, zFlag, pid) {
            if (typeof pC === "undefined") { pC = 0; }
            if (typeof acc === "undefined") { acc = 0; }
            if (typeof xReg === "undefined") { xReg = 0; }
            if (typeof yReg === "undefined") { yReg = 0; }
            if (typeof zFlag === "undefined") { zFlag = 0; }
            if (typeof pid === "undefined") { pid = 0; }
            this.pC = pC;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.pid = pid;
            this.pid = _PID;
            _PID++;
        }
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
