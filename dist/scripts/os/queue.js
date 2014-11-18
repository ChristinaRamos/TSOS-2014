/* ------------
Queue.ts
A simple Queue, which is really just a dressed-up JavaScript Array.
See the Javascript Array documentation at
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
Look at the push and shift methods, as they are the least obvious here.
------------ */
var TSOS;
(function (TSOS) {
    var Queue = (function () {
        function Queue(q) {
            if (typeof q === "undefined") { q = new Array(); }
            this.q = q;
        }
        Queue.prototype.getSize = function () {
            return this.q.length;
        };

        Queue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };

        Queue.prototype.enqueue = function (element) {
            this.q.push(element);
        };

        Queue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        };

        Queue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        };

        Queue.prototype.get = function (index) {
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].pid === index) {
                    return this.q[i];
                }
            }
            return false;
        };

        Queue.prototype.getRemove = function (index) {
            for (var i = 0; i < this.q.length; i++) {
                if (this.q[i].pid === index) {
                    var result = this.q[i];
                    this.q.splice(i, 1);
                    return result;
                }
            }
        };

        Queue.prototype.setBase = function (index, value) {
            this.q[index].setBase(value);
        };

        Queue.prototype.setLimit = function (index, value) {
            this.q[index].setLimit(value);
        };
        return Queue;
    })();
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
