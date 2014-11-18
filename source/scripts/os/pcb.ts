//PCB class

module TSOS {
	export class PCB {
		constructor(public PC: number = 0,
					public Acc: number = 0,
					public Xreg: number = 0,
					public Yreg: number = 0,
					public Zflag: number = 0,
					public pid: number = 0,
					public alreadyRan: boolean = false,
					public base: number = 0,
					public limit: number = 0,
					public state: string = "New") {
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
