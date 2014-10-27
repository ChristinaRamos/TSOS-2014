module TSOS {
	export class PCB {
		constructor(public pC: number = 0,
					public acc: number = 0,
					public xReg: number = 0,
					public yReg: number = 0,
					public zFlag: number = 0,
					public pid: number = 0) {
			this.pid = _PID;
			_PID++;
		}
		public printPCB(): void {
			_StdOut.putText("PC: " + this.pC + 
							" | Acc: " + this.acc + 
							" | X Reg: " + this.xReg + 
							" | Y Reg: " + this.yReg +
							" | zFlag: " + this.zFlag);
		}
	}
}
