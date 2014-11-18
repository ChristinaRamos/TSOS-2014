/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {

        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }

        public get(index: number) {
            for(var i = 0; i < this.q.length; i++) {
                if(this.q[i].pid === index) {
                    return this.q[i];
                }
            }
            return false;
        }

        public getRemove(index: number) {
            for(var i = 0; i < this.q.length; i++) {
                if(this.q[i].pid === index) {
                    var result = this.q[i];
                    this.q.splice(i, 1);
                    return result;
                }
            }
        }

        public setBase(index: number, value: number): void {
            this.q[index].setBase(value); 
        }

        public setLimit(index: number, value: number): void {
            this.q[index].setLimit(value);
        }
    }
}
