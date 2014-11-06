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
            this.displayCPU();
        }
        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            this.displayPCB();
            this.displayCPU();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // If the program already ran, print a thing and stop executing.
            if(_ProgramList[_CurrentProgram].alreadyRan === true) {
                _StdOut.putText("This program has already run.  You better go catch it.");
                this.isExecuting = false;
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }
            //Otherwise, let's do this thing.
            else {
                this.execProg(_MemoryManager.getMem(this.PC));
            }
        }

        public execProg(opcode): void {
            //Call a function based on the opcode
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
            
        }

        public loadConstant(): void {
            //Set the accumulator to the value in the next memory byte
            var nextByte = _MemoryManager.nextByte();
            this.Acc = _MemoryManager.hexToDecimal(nextByte);
        }

        public loadAcc(): void {
            //Set the accumulator to the value stored in the specified memory byte
            var memLocation = _MemoryManager.hexToDecimal(_MemoryManager.nextTwoBytes());
            this.Acc = _MemoryManager.hexToDecimal(_MemoryManager.getMem((memLocation)));
        }

        public storeAcc(): void {
            //Store the accumulator at the specified memory location
            var memLocation = _MemoryManager.nextTwoBytes();
            _MemoryManager.setMem(_MemoryManager.hexToDecimal(memLocation), _MemoryManager.decimalToHex(this.Acc));
        }

        public addWithCarry(): void {
            //Add the accumulator and the value at the specified memory location
            //Store result in accumulator
            var memLocation = _MemoryManager.nextTwoBytes();
            var num = _MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation));
            this.Acc += parseInt(num, 16);
        }

        public loadXConstant(): void {
            //Load x with the constant in the next byte
            var nextByte = _MemoryManager.nextByte();
            this.Xreg = _MemoryManager.hexToDecimal(nextByte);           
        }

        public loadYConstant(): void {
            //Load y with the constant in the next byte
            var nextByte = _MemoryManager.nextByte();
            this.Yreg = _MemoryManager.hexToDecimal(nextByte);    
        }

        public loadX(): void {
            //Load x with the value at the specified byte in memory
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Xreg = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);    
        }

        public loadY(): void {
            //Load y with the value at the specified byte in memory
            var memLocation = _MemoryManager.nextTwoBytes();
            this.Yreg = parseInt(_MemoryManager.getMem(_MemoryManager.hexToDecimal(memLocation)), 16);    
        }

        public compareByteToX(): void {
            //Compare the contents of the x register with the value at the specified byte in memory
            //If they're equal, set the Z flag to 1, otherwise set it to 0
            var memLocation = _MemoryManager.nextTwoBytes();
            var memIndex = _MemoryManager.hexToDecimal(memLocation);
            var mem = _MemoryManager.getMem(memIndex);
            var memNum = _MemoryManager.hexToDecimal(mem);
            if(memNum === this.Xreg) {
                this.Zflag = 1;
            }
            else
                this.Zflag = 0;
        }

        public incrementByte(): void {
            //Increment the value at the specified memory byte by 1
            var memLocation = _MemoryManager.nextTwoBytes();
            var index = _MemoryManager.hexToDecimal(memLocation);
            var value = parseInt(_MemoryManager.getMem(index), 16) + 1;
            _MemoryManager.setMem(index, _MemoryManager.decimalToHex(value));            
        }

        public sysBreak(): void {
            //Store the CPU's current state in the PCB.
            this.updatePCB();
            _ProgramList[_CurrentProgram].alreadyRan = true;
            _KernelInterruptQueue.enqueue(new Interrupt(CPU_BREAK_IRQ, null));
        }

        public branch(): void {
            //If Z flag is 0, branch by the number stored in the specified memory byte
            if(this.Zflag === 0) {
                this.PC += _MemoryManager.hexToDecimal(_MemoryManager.getMem(++this.PC).toString()) + 1;
                //If the PC exceeds memory, wrap it around
                if(this.PC >= _MemorySize) {
                    this.PC -= _MemorySize;
                }
            }
            //If we don't do anything, advance the PC so we don't die
            else
                this.PC++;
        }

        public sysCall(): void {
            //Put another pancake on the Kernel
            //Wait, it's a queue not a stack
            //Starve then
            _KernelInterruptQueue.enqueue(new Interrupt(SYS_CALL_IRQ, null));
        }

        public printResults(): void {
            //Make sure we print stuff with leading zeroes if needed
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
            //Store CPU's current state in PCB
            _ProgramList[_CurrentProgram].pC = this.PC;
            _ProgramList[_CurrentProgram].acc = this.Acc;
            _ProgramList[_CurrentProgram].xReg = this.Xreg;
            _ProgramList[_CurrentProgram].yReg = this.Yreg;
            _ProgramList[_CurrentProgram].zFlag = this.Zflag;
        }

        public displayPCB(): void {
            //Kind of self explanatory
            var output = "<tr>";
            output += "<td id='cell'" + 0 + "'>" + "PC: " + this.PC.toString() + '</td>';
            output += "<td id='cell'" + 1 + "'>" + "Acc: " + this.Acc.toString() + '</td>';
            output += "<td id='cell'" + 2 + "'>" + "Xreg: " + this.Xreg.toString() + '</td>';
            output += "<td id='cell'" + 3 + "'>" + "Yreg: " + this.Yreg.toString() + '</td>';
            output += "<td id='cell'" + 4 + "'>" + "Zflag: " + this.Zflag.toString() + '</td>';
            output += "</tr>"

            Control.displayPCB(output);
        }

        public displayCPU(): void {
            //For this project's purposes, display CPU and display PCB do the same thing.
            var output = "<tr>";
            output += "<td id='cell'" + 0 + "'>" + "PC: " + this.PC.toString() + '</td>';
            output += "<td id='cell'" + 1 + "'>" + "Acc: " + this.Acc.toString() + '</td>';
            output += "<td id='cell'" + 2 + "'>" + "Xreg: " + this.Xreg.toString() + '</td>';
            output += "<td id='cell'" + 3 + "'>" + "Yreg: " + this.Yreg.toString() + '</td>';
            output += "<td id='cell'" + 4 + "'>" + "Zflag: " + this.Zflag.toString() + '</td>';
            output += "</tr>"

            Control.displayCPU(output);
        }
    }
}
