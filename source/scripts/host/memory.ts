/**
 * Simulation of computer memory.
 * Disclaimer: I have no idea what I'm doing.
 * Brace for impact.
 */

module TSOS {
	export class Memory {
		constructor(public memArray = new String[_MemorySize]){
			this.init();
		}

		public init(): void {
			for(var i = 0; i < _MemorySize; i++){
				this.memArray[i] = "00";
			}
		}


	
	}
}