module TSOS {
	export class FileSystem extends DeviceDriver{
		private track: number;
		private sector: number;
		private block: number;
		private metaData: number;
		private dataData: number;
		constructor () {
			//These are the places where the string of data blob will get chopped up (substringed)
			//Because magic numbers are Satan
			this.track = 4;
			this.sector = 8;
			this.block = 8;
			this.metaData = 4;
			this.dataData = 120;
			//I sure hope this works like the keyboard driver
			super(this.krnFSDriverEntry, this.krnFile);
		}

		public krnFSDriverEntry(): void {
			_FileNames = new Array();
			this.status = "loaded";
		}

		public krnFile(): void {

		}

		public init(): void {
			var filler = new Array(this.dataData + this.metaData + 1).join('0');
			sessionStorage.setItem("000", alanQuote);
			for (var t = 0; t <= this.track - 1; t++){
              	for (var s = 0; s <= this.sector - 1; s++){
                	for (var b = 0; b <= this.block - 1; b++){
                		if(t.toString() + s.toString() + b.toString() !== "000") {
                			sessionStorage.setItem(t.toString() + s.toString() + b.toString(), filler);
                		}
					}
				}
			}
		}

		public hexToString(hex:string) {
		    var str = '';
		    for (var i = 0; i < hex.length; i+= 2)
		        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		    return str;
		}

		public stringToHex(str:string) {
			var arr = [];
		  	for (var i = 0, l = str.length; i < l; i++) {
			    var hex = Number(str.charCodeAt(i)).toString(16);
			    arr.push(hex);
			}
		  	return arr.join('');
		}

		public diskIsFull(): boolean {
			for (var t = 0; t <= this.track - 1; t++){
              	for (var s = 0; s <= this.sector - 1; s++){
                	for (var b = 0; b <= this.block - 1; b++){
                		if(sessionStorage.getItem(t.toString() + s.toString() + b.toString()).substr(0,1) === "0")
                			return true;
                	}
                }
            }

            return false;
		}

		public createFile(filename): boolean {
			if(!this.diskIsFull()) {
				if(filename.length === 0) {
					_StdOut.putText("You didn't fucking type a filename.");
				else if(filename.stringToHex.length > 64) {

				}

				return true;
				}

			else
				return false;
			}
		}

		public nextEmptyTSB(): string {
			for (var t = 0; t <= this.track - 1; t++){
              	for (var s = 0; s <= this.sector - 1; s++){
                	for (var b = 0; b <= this.block - 1; b++){
                		if(sessionStorage.getItem(t.toString() + s.toString() + b.toString()).substr(0,1) === "0")
                			return t.toString() + s.toString() + b.toString();
                	}
                }
            }
		}
		
	}
}