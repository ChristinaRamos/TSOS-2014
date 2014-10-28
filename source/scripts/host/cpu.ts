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
            //this.PC++;
            switch(opcode) {
                case "A9": 
                    this.loadConstant();
                    break;

                case "AD":
                    this.loadAcc();
                    break;

                case "8D":
                    this.storeAcc();
                    break;

                case "6D":
                    this.addWithCarry();
                    break;

                case "A2":
                    this.loadXConstant();
                    break;

                case "AE":
                    this.loadX();
                    break;

                case "A0":
                    this.loadYConstant();
                    break;

                case "AC":
                    this.loadY();
                    break;

                case "EC":
                    this.compareByteToX();
                    break;

                case "EE":
                    this.incrementByte();
                    break;

                case "EA":
                    break; 

                case "00":
                    this.sysBreak();
                    break;

                case "D0":
                    this.branch();
                    break;

                case "FF":
                    this.sysCall();
             }

            this.isExecuting = false;
        }

        public loadConstant(): void {
            //debugger;
            var nextByte = _MemoryManager.nextByte();
            this.Acc = _MemoryManager.hexToDecimal(nextByte);
            //this.PC++;            
            this.printResults();
        }

        public loadAcc(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Acc = _MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation));
            //this.PC++;
            //this.PC++;            
            this.printResults();
        }

        public storeAcc(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), this.Acc.toString());
            //this.PC++;
            //this.PC++;
            this.printResults();

        }

        public addWithCarry(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Acc = this.Acc + _MemoryManager.hexToDecimal(memLocation);
        }

        public loadXConstant(): void {
            var nextByte = _MemoryManager.getMem(this.PC).toString();
            this.Xreg = _MemoryManager.hexToDecimal(nextByte);
            //this.PC++;            
            this.printResults();
        }

        public loadYConstant(): void {
            var nextByte = _MemoryManager.getMem(this.PC).toString();
            this.Yreg = _MemoryManager.hexToDecimal(nextByte);
            //this.PC++;            
            this.printResults();
        }

        public loadX(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Xreg = _MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation));
            //this.PC++;
            //this.PC++;            
            this.printResults();
        }

        public loadY(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Yreg = _MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation));
            //this.PC++;
            //this.PC++;            
            this.printResults();
        }

        public compareByteToX(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            if(this.Xreg === _MemoryManager.hexToDecimal(memLocation)) {
                this.Zflag = 1;
            }
            //this.PC++;
            //this.PC++;            
            this.printResults();
        }

        public incrementByte(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), (_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)) + 1).toString());
            //this.PC++;
            //this.PC++;            
            this.printResults();
        }

        public sysBreak(): void {
            _KernelInterruptQueue.enqueue();
        }

        public branch(): void {
            if(this.Zflag === 0) {
                this.PC += _MemoryManager.hexToDecimal(_MemoryManager.getMem(++this.PC).toString());

                if(this.PC >= _MemorySize) {
                    this.PC -= _MemorySize;
                }
            }
        }

        public sysCall(): void {
            if(this.Xreg === 1) {
                _StdOut.putText = this.Yreg;
            }

            else if(this.Xreg === 2) {
                var termString = _MemoryManager.getMem(this.Yreg);
            }
        }

        public printResults(): void {
            var acc = "";
            if(this.Acc.toString().length === 1) {
                acc = "0" + this.Acc.toString();
            }
            else {
                acc = this.Acc.toString();
            }

            _StdOut.putText("PC: " + this.PC + 
                            " | Acc: " + acc + 
                            " | X Reg: " + this.Xreg + 
                            " | Y Reg: " + this.Yreg +
                            " | zFlag: " + this.Zflag);
        }
    }
}
