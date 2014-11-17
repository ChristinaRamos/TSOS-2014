var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(readyQueue, residentQueue, ticks) {
            if (typeof readyQueue === "undefined") { readyQueue = []; }
            if (typeof residentQueue === "undefined") { residentQueue = _ResidentQueue; }
            if (typeof ticks === "undefined") { ticks = 0; }
            this.readyQueue = readyQueue;
            this.residentQueue = residentQueue;
            this.ticks = ticks;
        }
        CPUScheduler.prototype.load = function (program) {
            this.residentQueue.push(program);
        };

        CPUScheduler.prototype.runAll = function () {
            var residentLength = this.residentQueue.length;
            for (var i = 0; i < residentLength; i++) {
                this.readyQueue.push(this.residentQueue.shift());
            }
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
