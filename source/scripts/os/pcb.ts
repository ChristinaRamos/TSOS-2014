//PCB class

module TSOS {
	export class PCB {
		constructor(public pC: number = 0,
					public acc: number = 0,
					public xReg: number = 0,
					public yReg: number = 0,
					public zFlag: number = 0,
					public pid: number = 0,
					public alreadyRan: boolean = false,
					public base: number = 0,
					public limit: number = 0) {
			//Every time a PCB is created, it's a new program 
			//so increment dat PID
			this.pid = _PID;
			_PID++;
		}

		public setBase(num: number): void {
			this.base = num;
		}

		public setLimit(num: number): void {
			this.limit = num;
		}
	}
}
