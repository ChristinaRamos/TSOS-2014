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
    		debugger;
    		var residentLength = this.residentList.getSize();
    		for(var i = 0; i < residentLength; i++) {
    			this.readyQueue.enqueue(this.residentList.dequeue());
    			this.readyQueue.q[i].state = "Ready";
    		}

            if(_Schedule === "priority") {
                this.reorderReadyQueue();
            }

    		_CurrentProgram = this.readyQueue.dequeue();
    		_CurrentPID = _CurrentProgram.pid;
    		_CPU.updateCPU();
    		_CPU.isExecuting = true;
    		_CurrentProgram.state = "Running";
    	}

    	public rockinRobin(): void {
    		if(this.readyQueue.getSize() < 1) {
    			this.ticks = 0;
    		}
    		else {
	    		this.ticks = 0;
	    		_CPU.updatePCB();
	    		if(_CurrentProgram.state !== "Ran" && _CurrentProgram.state !== "Killed") {
	    			this.readyQueue.enqueue(_CurrentProgram);
	    			_CurrentProgram.state = "Ready";
    			}
    		
	    		_CurrentProgram = this.readyQueue.dequeue();
	    		_CurrentPID = _CurrentProgram.pid;
	    		_CPU.updateCPU();
	    		_MemoryManager.displayMem();
	    		_CPU.displayPCB();
	    		//_CPU.cycle();
	    	}
    	}

    	public fcfs(): void {
    		_CurrentProgram = this.readyQueue.dequeue();
    		_CurrentPID = _CurrentProgram.pid;
    		_CPU.updateCPU();
    		_MemoryManager.displayMem();
    		_CPU.displayPCB();
    	}

    	public schedule(): void {
    		if(_Schedule === "rr") {
    			this.rockinRobin();
    		}

    		else if(_Schedule === "fcfs" || _Schedule === "priority") {
    			this.fcfs();
    		}
    	}

    	public compare(a,b): number {
		    if (a.priority < b.priority)
		        return -1;
		    if (a.priority > b.priority)
		        return 1;
		    return 0;
		}

    	public reorderReadyQueue(): void {
            debugger;
    		this.readyQueue.q.sort(this.compare);
    	}

        public setPriority(priority: number): void {
            this.residentList.q[this.residentList.getSize() - 1].priority = priority;
        }

    	

    }
}

//dequeue removes from the front of the queue
//enqueue adds to the end of the queue

/*  Programs to test:

	Counts to 2 and prints DONE:
	A9 03 8D 41 00 A9 01 8D 40 00 AC 
	40 00 A2 01 FF EE 40 00 AE 40 00 
	EC 41 00 D0 EF A9 44 8D 42 00 A9 
	4F 8D 43 00 A9 4E 8D 44 00 A9 45 
	8D 45 00 A9 00 8D 46 00 A2 02 A0 
	42 FF 00	

	Prints 2 and 5:
	A9 00 8D 00 00 A9 00 8D 3B 00 A9 
	01 8D 3B 00 A9 00 8D 3C 00 A9 02 
	8D 3C 00 A9 01 6D 3B 00 8D 3B 00 
	A9 03 6D 3C 00 8D 3C 00 AC 3B 00 
	A2 01 FF A0 3D A2 02 FF AC 3C 00 
	A2 01 FF 00 00 00 20 61 6E 64 20 
	00

	Prints counting 0 counting 1 counting hello world counting 2:
	A9 00 8D 00 00 A9 00 8D 4B 00 A9 
	00 8D 4B 00 A2 03 EC 4B 00 D0 07 
	A2 01 EC 00 00 D0 05 A2 00 EC 00 
	00 D0 26 A0 4C A2 02 FF AC 4B 00 
	A2 01 FF A9 01 6D 4B 00 8D 4B 00 
	A2 02 EC 4B 00 D0 05 A0 55 A2 02 
	FF A2 01 EC 00 00 D0 C5 00 00 63 
	6F 75 6E 74 69 6E 67 00 68 65 6C 
	6C 6F 20 77 6F 72 6C 64 00
*/