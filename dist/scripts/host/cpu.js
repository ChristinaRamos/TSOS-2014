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
            this.displayCPU();
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            this.displayPCB();
            this.displayCPU();

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // If the program already ran, print a thing and stop executing.
            if (_CurrentProgram.state === "Ran") {
                this.isExecuting = false;
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            } else {
                _CurrentProgram.state = "Running";
                this.execProg(_MemoryManager.getMem(this.PC));
                _CPUScheduler.ticks++;
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

            //increment the PC after executing the instruction
            this.PC++;

            //display errythang
            _MemoryManager.displayMem();
            //this.printResults();
        };

        Cpu.prototype.loadConstant = function () {
            //Set the Accumulator to the value in the next memory byte
            var nextByte = _MemoryManager.nextByte();
            this.Acc = _MemoryManager.hexToDecimal(nextByte);
        };

        Cpu.prototype.loadAcc = function () {
            //Set the Accumulator to the value stored in the specified memory byte
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes()) + _CurrentProgram.base;
            this.Acc = _MemoryManager.hexToDecimal(_MemoryManager.getMem((memLocation)));
        };

        Cpu.prototype.storeAcc = function () {
            //Store the Accumulator at the specified memory location
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes()) + _CurrentProgram.base;
            _MemoryManager.setMemBoundsCheck(memLocation, _MemoryManager.decimalToHex(this.Acc));
        };

        Cpu.prototype.addWithCarry = function () {
            //Add the Accumulator and the value at the specified memory location
            //Store result in Accumulator
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes()) + _CurrentProgram.base;
            var num = _MemoryManager.getMem(memLocation);
            this.Acc += parseInt(num, 16);
        };

        Cpu.prototype.loadXConstant = function () {
            //Load x with the constant in the next byte
            var nextByte = _MemoryManager.nextByte();
            this.Xreg = _MemoryManager.hexToDecimal(nextByte);
        };

        Cpu.prototype.loadYConstant = function () {
            //Load y with the constant in the next byte
            var nextByte = _MemoryManager.nextByte();
            this.Yreg = _MemoryManager.hexToDecimal(nextByte);
        };

        Cpu.prototype.loadX = function () {
            //Load x with the value at the specified byte in memory
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes()) + _CurrentProgram.base;
            this.Xreg = parseInt(_MemoryManager.getMem(memLocation), 16);
        };

        Cpu.prototype.loadY = function () {
            //Load y with the value at the specified byte in memory
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes()) + _CurrentProgram.base;
            this.Yreg = parseInt(_MemoryManager.getMem(memLocation), 16);
        };

        Cpu.prototype.compareByteToX = function () {
            //Compare the contents of the x register with the value at the specified byte in memory
            //If they're equal, set the Z flag to 1, otherwise set it to 0
            var memLocation = _MemoryManager.nextTwoBytes();
            var memIndex = _MemoryManager.hexToDecimal(memLocation) + _CurrentProgram.base;
            var mem = _MemoryManager.getMem(memIndex);
            var memNum = _MemoryManager.hexToDecimal(mem);
            if (memNum === this.Xreg) {
                this.Zflag = 1;
            } else
                this.Zflag = 0;
        };

        Cpu.prototype.incrementByte = function () {
            //Increment the value at the specified memory byte by 1
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes());
            var index = memLocation + _CurrentProgram.base;
            var value = parseInt(_MemoryManager.getMem(index), 16) + 1;
            _MemoryManager.setMemBoundsCheck(index, _MemoryManager.decimalToHex(value));
        };

        Cpu.prototype.sysBreak = function () {
            //Store the CPU's current state in the PCB.
            _CurrentProgram.state = "Ran";
            this.updatePCB();
            this.displayPCB();
            _MemoryManager.memoryWipeOneBlock(_CurrentProgram);
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK_IRQ, null));
        };

        Cpu.prototype.branch = function () {
            //If Z flag is 0, branch by the number stored in the specified memory byte
            if (this.Zflag === 0) {
                this.PC += _MemoryManager.hexToDecimal(_MemoryManager.getMem(++this.PC).toString()) + 1;

                //If the PC exceeds memory, wrap it around
                if (this.PC >= _CurrentProgram.limit) {
                    this.PC -= _CurrentProgram.limit + 1;
                    this.PC += _CurrentProgram.base;
                }
            } else
                this.PC++;
        };

        Cpu.prototype.sysCall = function () {
            //Put another pancake on the Kernel
            //Wait, it's a queue not a stack
            //Starve then
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYS_CALL_IRQ, null));
        };

        Cpu.prototype.printResults = function () {
            //Make sure we print stuff with leading zeroes if needed
            var Acc = "";
            var x = "";
            var y = "";

            if (this.Acc.toString().length === 1) {
                Acc = "0" + this.Acc.toString();
            } else {
                Acc = this.Acc.toString();
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
            _StdOut.putText("PC: " + this.PC.toString() + " | Acc: " + Acc + " | X Reg: " + x + " | Y Reg: " + y + " | Zflag: " + this.Zflag.toString());
            _Console.advanceLine();
            _OsShell.putPrompt();
        };

        Cpu.prototype.updatePCB = function () {
            //Store CPU's current state in PCB
            _CurrentProgram.PC = this.PC;
            _CurrentProgram.Acc = this.Acc;
            _CurrentProgram.Xreg = this.Xreg;
            _CurrentProgram.Yreg = this.Yreg;
            _CurrentProgram.Zflag = this.Zflag;
        };

        Cpu.prototype.displayPCB = function () {
            var output = "<tr>";
            output += "<td id='cell'" + 0 + "'>" + "PID: " + _CurrentProgram.pid.toString() + '</td>';
            output += "<td id='cell'" + 1 + "'>" + "PC: " + _CurrentProgram.PC.toString() + '</td>';
            output += "<td id='cell'" + 2 + "'>" + "Acc: " + _CurrentProgram.Acc.toString() + '</td>';
            output += "<td id='cell'" + 3 + "'>" + "Xreg: " + _CurrentProgram.Xreg.toString() + '</td>';
            output += "<td id='cell'" + 4 + "'>" + "Yreg: " + _CurrentProgram.Yreg.toString() + '</td>';
            output += "<td id='cell'" + 5 + "'>" + "Zflag: " + _CurrentProgram.Zflag.toString() + '</td>';
            output += "<td id='cell'" + 6 + "'>" + "State: " + _CurrentProgram.state + '</td>';
            output += "<td id='cell'" + 7 + "'>" + "Base: " + _CurrentProgram.base.toString() + '</td>';
            output += "<td id='cell'" + 8 + "'>" + "Limit: " + _CurrentProgram.limit.toString() + '</td>';
            output += "<td id='cell'" + 9 + "'>" + "Priority: " + _CurrentProgram.priority.toString() + '</td>';
            output += "</tr>";
            if (typeof _CPUScheduler.readyQueue !== "undefined") {
                for (var i = 0; i < _CPUScheduler.readyQueue.getSize(); i++) {
                    output += "<tr>";
                    output += "<td id='cell'" + 0 + "'>" + "PID: " + _CPUScheduler.readyQueue.q[i].pid.toString() + '</td>';
                    output += "<td id='cell'" + 1 + "'>" + "PC: " + _CPUScheduler.readyQueue.q[i].PC.toString() + '</td>';
                    output += "<td id='cell'" + 2 + "'>" + "Acc: " + _CPUScheduler.readyQueue.q[i].Acc.toString() + '</td>';
                    output += "<td id='cell'" + 3 + "'>" + "Xreg: " + _CPUScheduler.readyQueue.q[i].Xreg.toString() + '</td>';
                    output += "<td id='cell'" + 4 + "'>" + "Yreg: " + _CPUScheduler.readyQueue.q[i].Yreg.toString() + '</td>';
                    output += "<td id='cell'" + 5 + "'>" + "Zflag: " + _CPUScheduler.readyQueue.q[i].Zflag.toString() + '</td>';
                    output += "<td id='cell'" + 6 + "'>" + "State: " + _CPUScheduler.readyQueue.q[i].state + '</td>';
                    output += "<td id='cell'" + 7 + "'>" + "Base: " + _CPUScheduler.readyQueue.q[i].base.toString() + '</td>';
                    output += "<td id='cell'" + 8 + "'>" + "Limit: " + _CPUScheduler.readyQueue.q[i].limit.toString() + '</td>';
                    output += "<td id='cell'" + 9 + "'>" + "Priority: " + _CurrentProgram.priority.toString() + '</td>';
                    output += "</tr>";
                }
            }

            TSOS.Control.displayPCB(output);
        };

        Cpu.prototype.displayCPU = function () {
            var output = "<tr>";
            output += "<td id='cell'" + 0 + "'>" + "PC: " + this.PC.toString() + '</td>';
            output += "<td id='cell'" + 1 + "'>" + "Acc: " + this.Acc.toString() + '</td>';
            output += "<td id='cell'" + 2 + "'>" + "Xreg: " + this.Xreg.toString() + '</td>';
            output += "<td id='cell'" + 3 + "'>" + "Yreg: " + this.Yreg.toString() + '</td>';
            output += "<td id='cell'" + 4 + "'>" + "Zflag: " + this.Zflag.toString() + '</td>';
            output += "</tr>";

            TSOS.Control.displayCPU(output);
        };

        Cpu.prototype.updateCPU = function () {
            this.PC = _CurrentProgram.PC;
            this.Acc = _CurrentProgram.Acc;
            this.Xreg = _CurrentProgram.Xreg;
            this.Yreg = _CurrentProgram.Yreg;
            this.Zflag = _CurrentProgram.Zflag;
            this.displayCPU();
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
