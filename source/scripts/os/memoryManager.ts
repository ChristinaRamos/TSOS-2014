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

		public setMem(index: number, value: number): void {
			this.mem.memArray[index] = value;
		}

		public nextByte(): string {
			return this.mem.memArray[++_CPU.PC];
		}

		public loadProg(): void {
			
		}

		public hexToDecimal(hexNum: string) {
			return parseInt(hexNum, 16);
		}

		public decimalToHex(decNum: number) {
			return decNum.toString(16).toUpperCase();
		}

	}
}