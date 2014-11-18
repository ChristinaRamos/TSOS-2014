module TSOS {
    export class CPUScheduler {
    	constructor(public readyQueue: Queue = new Queue(),
    				public residentList: Queue = new Queue(),
    				public ticks: number = 0) {

    	}

    	public loadProg(program: PCB): void {
    		this.residentList.enqueue(program);
    	}

    	public runAll(): void {
    		
    	}

    	public rockinRobin(): void {
    		
    	}
    }
}
