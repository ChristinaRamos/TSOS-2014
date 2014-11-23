/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME: string    = "Quantum of SolOS";   // 'cause best move ever amirite?
var APP_VERSION: string = "realest bestest one true 0.07";   // What did you expect?  No really, what DID you expect?

var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                            // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ: number = 1;

var CPU_BREAK_IRQ: number = 2;	//IRQ for stopping the CPU from executing

var SYS_CALL_IRQ: number = 3;	//IRQ for opcode FF

var MEMORY_EXCEEDED_IRQ: number = 4;	//IRQ for someone screwed up bad
	
var STARTING_X_POS: number = 12.48;		//Magic numbers are bad so here's a global for the x position right after the prompt.
//
// Global Variables
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement = null;  // Initialized in hostInit().
var _DrawingContext = null;             // Initialized in hostInit().
var _DefaultFontFamily = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;              // Additional space added to font size when advancing a line.


var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers: any[] = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID: number = null;

// For testing...
var _GLaDOS: any = null;
var Glados: any = null;

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};

// Memory stuff
var _MemoryBlocks: number = 3;
var _MemorySize: number = 256 * _MemoryBlocks;
var _Memory: TSOS.Memory;
var _MemoryManager: TSOS.MemoryManager;

// PCB stuff
var _PID = 0;
var _CurrentPID: number =  null;
var _CurrentProgram;
var _LineWrapped: boolean = false;

//Scheduling stuff
var _QuantumOfSolace: number = 6;
var _CPUScheduler: TSOS.CPUScheduler;
var _ProgramFinished: boolean = false;