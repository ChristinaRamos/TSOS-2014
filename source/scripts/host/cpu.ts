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
            debugger;
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(_ProgramList[_CurrentProgram].alreadyRan === true) {
                _StdOut.putText("This program has already run.  You better go catch it.");
            }
            
            else {
                this.execProg(_MemoryManager.getMem(this.PC));
            }
        }

        public execProg(opcode): void {
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
                debugger;
                    this.sysCall();
                    break;

                default:
                    this.isExecuting = false;
                    _Kernel.krnTrapError("Invalid opcode.  Welcome to DIE.");
             }

             this.PC++;
        }

        public loadConstant(): void {
            var nextByte = _MemoryManager.nextByte();
            this.Acc = _MemoryManager.hexToDecimal(nextByte);
                        
            this.printResults();
        }

        public loadAcc(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Acc = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);
            
                        
            this.printResults();
        }

        public storeAcc(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), this.Acc.toString());
            
            
            this.printResults();

        }

        public addWithCarry(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            var num = _MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation));
            this.Acc += parseInt(num, 16);
            this.printResults();
        }

        public loadXConstant(): void {
            var nextByte = _MemoryManager.nextByte();
            this.Xreg = _MemoryManager.hexToDecimal(nextByte);
                        
            this.printResults();
        }

        public loadYConstant(): void {
            var nextByte = _MemoryManager.nextByte();
            this.Yreg = _MemoryManager.hexToDecimal(nextByte);
                        
            this.printResults();
        }

        public loadX(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Xreg = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);
            
                        
            this.printResults();
        }

        public loadY(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Yreg = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);
            
                        
            this.printResults();
        }

        public compareByteToX(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            if(this.Xreg === _MemoryManager.hexToDecimal(memLocation)) {
                this.Zflag = 1;
            }
            
                        
            this.printResults();
        }

        public incrementByte(): void {
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), (_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)) + 1).toString());
            
                        
            this.printResults();
        }

        public sysBreak(): void {
            this.updatePCB();
            _ProgramList[_CurrentProgram].alreadyRan = true;
            _KernelInterruptQueue.enqueue(new Interrupt(CPU_BREAK_IRQ, null));
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
            debugger;
            _KernelInterruptQueue.enqueue(new Interrupt(SYS_CALL_IRQ, null));
        }

        public printResults(): void {
            var acc = "";
            var x = "";
            var y = "";

            if(this.Acc.toString().length === 1) {
                acc = "0" + this.Acc.toString();
            }
            else {
                acc = this.Acc.toString();
            }

            if(this.Xreg.toString().length === 1) {
                x = "0" + this.Xreg.toString();
            }
            else {
                x = this.Xreg.toString();
            }

            if(this.Yreg.toString().length === 1) {
                y = "0" + this.Yreg.toString();
            }
            else {
                y = this.Yreg.toString();
            }
            _StdOut.putText("PC: " + this.PC.toString() + 
                            " | Acc: " + acc + 
                            " | X Reg: " + x + 
                            " | Y Reg: " + y +
                            " | zFlag: " + this.Zflag.toString());
            _Console.advanceLine();
            _OsShell.putPrompt();
        }

        public updatePCB(): void {
            _ProgramList[_CurrentProgram].pC = this.PC;
            _ProgramList[_CurrentProgram].acc = this.Acc;
            _ProgramList[_CurrentProgram].xReg = this.Xreg;
            _ProgramList[_CurrentProgram].yReg = this.Yreg;
            _ProgramList[_CurrentProgram].zFlag = this.Zflag;
        }
    }
}
