module TSOS {
    export class CPUScheduler {
    	constructor(public readyQueue = [],
    				public residentQueue = _ResidentQueue,
    				public ticks: number = 0) {

    	}

    	public load(program: PCB): void {
    		this.residentQueue.push(program);
    	}

    	public runAll(): void {
    		var residentLength = this.residentQueue.length;
    		for(var i = 0; i < residentLength; i++) {
    			this.readyQueue.push(this.residentQueue.shift());
    		}
    	}

    	public roundRobinSwitch(): void {
    		while(this.ticks !== 6) {
    			
    		}
    	}
    }
}
