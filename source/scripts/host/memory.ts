/**
 * Simulation of computer memory.
 * Disclaimer: I have no idea what I'm doing.
 * Brace for impact.
 */

module TSOS {
	export class Memory {
		constructor(public memArray = new Array(_MemorySize)){

		}

		public init(): void {
			for(var i = 0; i < this.memArray.length; i++){
				this.memArray[i] = "00";
			}
		}


	
	}
}