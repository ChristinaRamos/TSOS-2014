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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (_ProgramList[_CurrentProgram].alreadyRan === true) {
                _StdOut.putText("This program has already run.  You better go catch it.");
            } else {
                this.execProg(_MemoryManager.getMem(this.PC));
            }
        };

        Cpu.prototype.execProg = function (opcode) {
            switch (opcode) {
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
                    break;

                default:
                    this.isExecuting = false;
                    _Kernel.krnTrapError("Invalid opcode.  Welcome to DIE.");
            }

            this.PC++;
        };

        Cpu.prototype.loadConstant = function () {
            var nextByte = _MemoryManager.nextByte();
            this.Acc = _MemoryManager.hexToDecimal(nextByte);

            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.loadAcc = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Acc = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);

            //this.PC++;
            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.storeAcc = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), this.Acc.toString());

            //this.PC++;
            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.addWithCarry = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            var num = _MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation));
            this.Acc += parseInt(num, 16);
            this.printResults();
        };

        Cpu.prototype.loadXConstant = function () {
            var nextByte = _MemoryManager.nextByte();
            this.Xreg = _MemoryManager.hexToDecimal(nextByte);

            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.loadYConstant = function () {
            var nextByte = _MemoryManager.nextByte();
            this.Yreg = _MemoryManager.hexToDecimal(nextByte);

            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.loadX = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Xreg = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);

            //this.PC++;
            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.loadY = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Yreg = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);

            //this.PC++;
            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.compareByteToX = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            if (this.Xreg === _MemoryManager.hexToDecimal(memLocation)) {
                this.Zflag = 1;
            }

            //this.PC++;
            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.incrementByte = function () {
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), (_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)) + 1).toString());

            //this.PC++;
            //this.PC++;
            this.printResults();
        };

        Cpu.prototype.sysBreak = function () {
            this.updatePCB();
            _ProgramList[_CurrentProgram].alreadyRan = true;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK_IRQ, "Fuck you Murph"));
        };

        Cpu.prototype.branch = function () {
            if (this.Zflag === 0) {
                this.PC += _MemoryManager.hexToDecimal(_MemoryManager.getMem(++this.PC).toString());

                if (this.PC >= _MemorySize) {
                    this.PC -= _MemorySize;
                }
            }
        };

        Cpu.prototype.sysCall = function () {
            if (this.Xreg === 1) {
                _StdOut.putText = this.Yreg;
            } else if (this.Xreg === 2) {
                var termString = _MemoryManager.getMem(this.Yreg);
                _StdOut.putText(termString);
            }
        };

        Cpu.prototype.printResults = function () {
            var acc = "";
            var x = "";
            var y = "";

            if (this.Acc.toString().length === 1) {
                acc = "0" + this.Acc.toString();
            } else {
                acc = this.Acc.toString();
            }

            if (this.Xreg.toString().length === 1) {
                x = "0" + this.Xreg.toString();
            } else {
                x = this.Xreg.toString();
            }

            if (this.Yreg.toString().length === 1) {
                y = "0" + this.Yreg.toString();
            } else {
                y = this.Yreg.toString();
            }
            _StdOut.putText("PC: " + this.PC + " | Acc: " + acc + " | X Reg: " + x + " | Y Reg: " + y + " | zFlag: " + this.Zflag);
        };

        Cpu.prototype.updatePCB = function () {
            _ProgramList[_CurrentProgram].pC = this.PC;
            _ProgramList[_CurrentProgram].acc = this.Acc;
            _ProgramList[_CurrentProgram].xReg = this.Xreg;
            _ProgramList[_CurrentProgram].yReg = this.Yreg;
            _ProgramList[_CurrentProgram].zFlag = this.Zflag;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
