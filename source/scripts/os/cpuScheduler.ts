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
    		var residentLength = this.residentList.getSize();
    		for(var i = 0; i < residentLength; i++) {
    			this.readyQueue.enqueue(this.residentList.dequeue());
    		}
    	}

    	public rockinRobin(): void {
    		while(this.ticks !== 6) {
    			
    		}
    	}
    }
}
