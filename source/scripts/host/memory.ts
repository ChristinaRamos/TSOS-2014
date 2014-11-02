/**
 * Simulation of computer memory.
 * Disclaimer: I have no idea what I'm doing.
 * Brace for impact.
 * It's an array of goddamn strings of length 2.  THAT'S ALL IT IS.
 */

module TSOS {
	export class Memory {
		constructor(public memArray){
			this.memArray = new Array(_MemorySize);
			this.init();
		}

		public init(): void {
			for(var i = 0; i < _MemorySize; i++){
				this.memArray[i] = "00";
			}
		}


	
	}
}