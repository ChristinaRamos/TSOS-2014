///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public runProg(pid:number): void {
            this.isExecuting = true;
            this.execProg(_MemoryManager.getMem(this.PC));
        }

        public execProg(opcode): void {
            this.PC++;
            switch(opcode) {
                case "A9": 
                    this.loadConstant();
                    break;

                case "AD":
                    this.loadAcc();
                    break;
            }
            this.isExecuting = false;
        }

        public loadConstant(): void {
            //debugger;
            var nextByte = _MemoryManager.getMem(this.PC).toString();
            this.Acc = _MemoryManager.hexToDecimal(nextByte);
            this.PC++;            
            this.printResults();
        }

        public loadAcc(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Acc = _MemoryManager.getMem(parseInt(memLocation,10));
            this.PC++;            
            this.printResults();
        }

        public storeAcc(): void {

        }

        public printResults(): void {
            _StdOut.putText("PC: " + this.PC + 
                            " | Acc: " + this.Acc + 
                            " | X Reg: " + this.Xreg + 
                            " | Y Reg: " + this.Yreg +
                            " | zFlag: " + this.Zflag);
        }
    }
}
