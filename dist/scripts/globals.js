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
var APP_NAME = "Quantum of SolOS";
var APP_VERSION = "realest bestest one true 0.07";

var CPU_CLOCK_INTERVAL = 100;

var TIMER_IRQ = 0;

// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

var CPU_BREAK_IRQ = 2;

var SYS_CALL_IRQ = 3;

var MEMORY_EXCEEDED_IRQ = 4;

var KILL_IRQ = 5;

var STARTING_X_POS = 12.48;

//
// Global Variables
//
var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "sans";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;
var _krnFileSystem = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};

// Memory stuff
var _MemoryBlocks = 3;
var _MemorySize = 256 * _MemoryBlocks;
var _Memory;
var _MemoryManager;

// PCB stuff
var _PID = 0;
var _CurrentPID = null;
var _CurrentProgram;
var _LineWrapped = false;

//Scheduling stuff
var _QuantumOfSolace = 6;
var _CPUScheduler;
var _ProgramFinished = false;
var _Schedule = "rr";

var alanQuote = "22492063616e20646f20776861746576657220746865204655434b20492077616e742122202d20416c616e2032303134";
var _FileNames;
