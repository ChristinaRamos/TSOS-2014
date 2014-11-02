module TSOS {

    export class MemoryManager {

        constructor(public mem: Memory = new Memory(_MemorySize)) {

        }

        public init(): void {
       		this.displayMem();
        }

        public displayMem(): void {
        	var output = "<tr>";

        	for(var i = 0; i < _MemorySize; i++) {
        		if(i % 8 === 0) {
        			output += "</tr><tr><td><b>" + "0x" + this.decimalToHex(i) + "</b></td>";
        		}
        		output += "<td id='cell'" + i + "'>" + this.mem.memArray[i] + '</td>';
        	}
        	output += "</tr>"
        	Control.displayMemory(output);
        }
        public getMem(index: number): string {
			return this.mem.memArray[index];
		}

		public setMem(index: number, value: string): void {
			if(index > _MemorySize) {
				_KernelInterruptQueue.enqueue(new Interrupt(MEMORY_EXCEEDED_IRQ, null));
			}
			if(value.length === 1) {
				this.mem.memArray[index] = "0" + value;
				this.displayMem();	
			}
			else {
				this.mem.memArray[index] = value;
				this.displayMem();
			}

		}

		public nextByte(): string {
			return this.getMem(++_CPU.PC);
		}

		public nextTwoBytes(): string {
			var nextTwo = "";
			nextTwo = this.getMem(++_CPU.PC) + this.getMem(++_CPU.PC);
			nextTwo = nextTwo.substr(2,2) + nextTwo.substr(0,2);
			return nextTwo;

		}

		public loadProg(): void {
			_CPU.PC = 0;
			var program = Control.getProgramInput();
			var substr = "";
			var count = 0;
			for(var i = 0; i < program.length; i += 2) {
				substr = program.substr(i, 2);
				this.setMem(count, substr);
				count++;
			}
			_StdOut.putText("PID is " + _PID + ".");
			_ProgramList[_ProgramList.length] = new PCB;
		}

		public hexToDecimal(hexNum: string) {
			return parseInt(hexNum, 16);
		}

		public decimalToHex(decNum: number) {
			return decNum.toString(16).toUpperCase();
		}
	}
}