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
        			output += "</tr><tr><td>" + "</td>";
        		}
        		output += "<td id='cell'" + i + "'>" + this.mem.memArray[i] + '</td>';
        	}
        	output += "</tr>"
        	Control.displayMemory(output);
        }
        public getMem(index: number): number {
			return this.mem.memArray[index];
		}

		public setMem(index: number, value: string): void {
			this.mem.memArray[index] = value;
			this.displayMem();
		}

		public nextByte(): string {
			return this.mem.memArray[++_CPU.PC];
		}

		public nextTwoBytes(): string {
			var nextTwo = "";
			nextTwo = this.mem.memArray[++_CPU.PC] + this.mem.memArray[++_CPU.PC];
			nextTwo = nextTwo.substr(2,2) + nextTwo.substr(0,2);
			return nextTwo;

		}

		public loadProg(): void {
			_CPU.PC = 0;
			var program = Control.getProgramInput();
			var substr = "";
			var opcode = "";
			opcode = program.substr(0,2);
			for(var i = 0; i < program.length; i+=2) {
				substr = program.substr(i, 2);
				this.setMem(_CPU.PC, substr);
				this.nextByte();
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