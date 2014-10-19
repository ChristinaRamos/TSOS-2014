var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(pC, acc, xReg, yReg, zFlag, pid, iR, base, limit) {
            if (typeof pC === "undefined") { pC = 0; }
            if (typeof acc === "undefined") { acc = 0; }
            if (typeof xReg === "undefined") { xReg = 0; }
            if (typeof yReg === "undefined") { yReg = 0; }
            if (typeof zFlag === "undefined") { zFlag = 0; }
            if (typeof pid === "undefined") { pid = 0; }
            if (typeof iR === "undefined") { iR = ""; }
            if (typeof base === "undefined") { base = 0; }
            if (typeof limit === "undefined") { limit = 0; }
            this.pC = pC;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.pid = pid;
            this.iR = iR;
            this.base = base;
            this.limit = limit;
            this.pid = _PID;
        }
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
