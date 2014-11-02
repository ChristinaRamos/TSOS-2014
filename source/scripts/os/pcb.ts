//PCB class

module TSOS {
	export class PCB {
		constructor(public pC: number = 0,
					public acc: number = 0,
					public xReg: number = 0,
					public yReg: number = 0,
					public zFlag: number = 0,
					public pid: number = 0,
					public alreadyRan: boolean = false) {
			//Every time a PCB is created, it's a new program 
			//so increment dat PID
			this.pid = _PID;
			_PID++;
		}
	}
}
