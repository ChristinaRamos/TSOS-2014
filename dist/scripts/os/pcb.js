//PCB class
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PC, Acc, Xreg, Yreg, Zflag, pid, base, limit, state) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof pid === "undefined") { pid = 0; }
            if (typeof base === "undefined") { base = 0; }
            if (typeof limit === "undefined") { limit = 0; }
            if (typeof state === "undefined") { state = "New"; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.pid = pid;
            this.base = base;
            this.limit = limit;
            this.state = state;
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
