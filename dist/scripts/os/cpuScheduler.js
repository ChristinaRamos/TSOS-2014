var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(readyQueue, residentList, ticks) {
            if (typeof readyQueue === "undefined") { readyQueue = new TSOS.Queue(); }
            if (typeof residentList === "undefined") { residentList = new TSOS.Queue(); }
            if (typeof ticks === "undefined") { ticks = 0; }
            this.readyQueue = readyQueue;
            this.residentList = residentList;
            this.ticks = ticks;
        }
        CPUScheduler.prototype.loadProg = function (program) {
            this.residentList.enqueue(program);
        };

        CPUScheduler.prototype.runAll = function () {
            var residentLength = this.residentList.getSize();
            for (var i = 0; i < residentLength; i++) {
                this.readyQueue.enqueue(this.residentList.dequeue());
            }
        };

        CPUScheduler.prototype.rockinRobin = function () {
            while (this.ticks !== 6) {
            }
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
