module TSOS {

    export class MemoryManager {
    	public nextBlock;
        constructor(public mem: Memory = new Memory(_MemorySize)) {
        	//It's just a stupid array.
        }

        public init(): void {
       		this.displayMem();
        }

        public displayMem(): void {
        	//Feed it HTML so it doesn't eat us instead
        	//Start with a table row
        	var output = "<tr>";

        	for(var i = 0; i < _MemorySize; i++) {
        		//Every 8, conclude this row and add another one
        		if(i % 8 === 0) {
        			//We need some nice 0xblah hex stuff on the side because it's nice.
        			output += "</tr><tr><td><b>" + "0x" + this.decimalToHex(i) + "</b></td>";
        		}
        		//This line highlights where the PC is in memory as it executes.  Nifty, eh?
        		if(i === _CPU.PC){
        			output += "<td id='cell' bgcolor='#FFB585'" + i + "'>" + this.mem.memArray[i] + '</td>';
        		}
        		//Otherwise, make a bunch of cells with memory in them!
        		else
        			output += "<td id='cell'" + i + "'>" + this.mem.memArray[i] + '</td>';
        	}
        	//conclude the last row
        	output += "</tr>"
        	//Send it over to control tower to do html magic.
        	Control.displayMemory(output);
        }

        public getMem(index: number): string {
        	//Gets the memory value at the specified index.
			return this.mem.memArray[index];
		}

		public setMem(index: number, value: string): void {
			//Don't exceed memory's limit or we all die.
			if(index > _MemorySize) {
				_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_EXCEEDED_IRQ, null));
			}
			//Add a leading 0 if the value is only 1 digit.  Otherwise, it looks freakin' weird.
			if(value.length === 1) {
				this.mem.memArray[index] = "0" + value;
				this.displayMem();	
			}
			//Otherwise, set memory with the given value
			else {
				this.mem.memArray[index] = value;
				this.displayMem();
			}

		}

		public nextByte(): string {
			//Get the value of the next byte of memory
			return this.getMem(++_CPU.PC);
		}

		public nextTwoBytes(): string {
			//Get the value of the next two bytes and swap the endianness
			var nextTwo = "";
			nextTwo = this.getMem(++_CPU.PC) + this.getMem(++_CPU.PC);
			nextTwo = nextTwo.substr(2,2) + nextTwo.substr(0,2);
			return nextTwo;

		}

		public loadProg(): void {
			//Set the PC to the correct block in memory 
			this.nextBlock = this.nextEmptyBlock();
			//Assign a PCB to the program
			_CPUScheduler.loadProg(new PCB());
			var residentSize = _CPUScheduler.residentList.getSize();
			//set base to next empty block
			_CPUScheduler.residentList.setBase(residentSize - 1, this.nextBlock);
			//set limit to next empty block's end point
			_CPUScheduler.residentList.setLimit(residentSize - 1, this.nextBlock + 255);
			// set pc to the proper start place
			_CPUScheduler.residentList.setPC(residentSize - 1, this.nextBlock);
			
			//Get the whole string of input from user program input box
			var program = Control.getProgramInput();
			var substr = "";
			var count = this.nextBlock;
			//Split the program into two's. A9 07 8D 40 00.
			for(var i = 0; i < program.length; i += 2) {
				//Set each cell in memory to the pairs of hex things
				substr = program.substr(i, 2);
				this.setMem(count, substr);
				count++;
			}
			//Announce the PID to console.
			_StdOut.putText("PID is " + (_PID-1) + ".");
		}

		public hexToDecimal(hexNum: string) {
			//Convert a hex string, most likely memory, to a decimal number
			return parseInt(hexNum, 16);
		}

		public decimalToHex(decNum: number) {
			//Convert a decimal number to a hex string and uppercase it
			//Lower case hex looks stupid.
			return decNum.toString(16).toUpperCase();
		}

		public memoryWipe(): void {
			_CPU.isExecuting = false;
			_CPUScheduler.residentList = new Queue();
			this.mem.init();
			this.displayMem();
		}

		public nextEmptyBlock() {
			var firstBlock = 0;
			var secondBlock = 256;
			var thirdBlock = 512;

			if(this.mem.memArray[firstBlock] === "00") {
				return firstBlock;
			}
			else if(this.mem.memArray[secondBlock] === "00") {
				return secondBlock;
			}
			else if(this.mem.memArray[thirdBlock] === "00") {
				return thirdBlock;
			}
			else
				_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_EXCEEDED_IRQ, null));
				return;
		}
	}
}