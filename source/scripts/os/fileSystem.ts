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
			this.init();
		}

		public krnFile(args): void {
			
		}

		public init(): void {
			var filler = new Array(this.dataData + this.metaData + 1).join('0');
			sessionStorage.setItem("000", "1000" + this.hexToString(alanQuote));
			for (var t = 0; t <= this.track - 1; t++){
              	for (var s = 0; s <= this.sector - 1; s++){
                	for (var b = 0; b <= this.block - 1; b++){
                		if(t.toString() + s.toString() + b.toString() !== "000") {
                			sessionStorage.setItem(t.toString() + s.toString() + b.toString(), filler);
                		}
					}
				}
			}

			Control.displayDingle();
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
                		if(this.getMeta(t.toString() + s.toString() + b.toString()).substr(0,1) === "0")
                			return false;
                	}
                }
            }

            return true;
		}

		public createFile(filename): boolean {
			if(filename in _FileNames) {
				_StdOut.putText("This file already exists.");
				return false;
			}

			if(!this.diskIsFull()) {
				var nextTSB = this.nextEmptyTSB();

				_FileNames[filename] = nextTSB;
				this.setMeta(nextTSB, "000");
				this.setData(nextTSB, this.stringToHex(filename));
				_StdOut.putText("File creation successful.  Maybe.");
				Control.displayDingle();	
				return true;				
			}

			else
				return false;
		}

		public writeFile(filename, data): boolean {
			var filenameTSB = _FileNames[filename];
			//check if file is already written to, then overwrite if needed
			var filenamePointer = this.getMeta(filenameTSB).substr(1);
			
			var dataHex = this.stringToHex(data);

			if(this.diskIsFull()) 
				return false;

			//if the filename is not pointing to anything, it hasn't been written to yet
			if(filenamePointer === "000") {
				
				var nextTSB = this.nextEmptyTSB();
				
				this.setMeta(filenameTSB, nextTSB);

				if(dataHex.length > this.dataData) 
					this.distributeData(filename, data);

				else
					this.setMeta(nextTSB, "000");
					this.setData(nextTSB, dataHex);
			}
				

			else {
				//file has already been written to, overwrite
				var fileMeta = this.getMeta(filenameTSB).substr(1);
				if(dataHex.length > this.dataData)
					this.distributeDataOver(filename, data);

				else
					this.setData(fileMeta, dataHex);	
			}

			Control.displayDingle();
			_StdOut.putText("Write successful.");
			return true;			
		}

		public readFile(filename): boolean {
			var filenameTSB = _FileNames[filename];
			var fileDataTSB = this.getMeta(filenameTSB).substr(1);
			var fileData = this.getData(fileDataTSB);
			var output = this.hexToString(fileData);
			_StdOut.putText(output);

			return true;
		}

		public deleteFile(filename): boolean {
			var filenameTSB = _FileNames[filename];
			var filePointer = this.getMeta(filenameTSB).substr(1);
			//delete filename
			this.clearBlock(filenameTSB);
			delete _FileNames[filename];
			//delete file data
			if(filePointer !== "000") {
				this.clearBlock(filePointer);
			}

			_StdOut.putText("File and contents deleted successfully.");

			Control.displayDingle();
			return true;			
		}

		public format(): void {
			this.init();
			_StdOut.putText("Formatting successful.");
		}

		public ls(): void {
			_StdOut.putText("Files on disk:");
			_StdOut.advanceLine();

			if(_FileNames.length === 0) {
				_StdOut.putText("None");
			}

			else {
				
				for(var file in _FileNames) {
					_StdOut.putText(file + ", ");
				}
			}
		}

		public distributeData(filename, data): void {
			var filenameTSB = _FileNames[filename];
			var dataHex = this.stringToHex(data);
			//if the data is too long, slice it until it's short enough
			while(dataHex.length > this.dataData) {
				var nextTSB = this.nextEmptyTSB();
				this.setMeta(nextTSB, this.nextEmptyTSB());
				this.setData(nextTSB, dataHex.slice(0, this.dataData + 1));
			}

			nextTSB = this.nextEmptyTSB();
			this.setMeta(nextTSB, "000");
			this.setData(nextTSB, dataHex);
		}

		public distributeDataOver(filename, data): void {
			var filenameTSB = _FileNames[filename]; //TSB of where the filename IS
			var dataHex = this.stringToHex(data);

			while(dataHex.length > this.dataData) {
				var nextTSB = this.getMeta(filenameTSB.substr(1));  //Get where file points next
				this.setData(nextTSB, dataHex.slice(0, this.dataData + 1));
				filenameTSB = nextTSB;
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

		public getData(tsb: string): string {
			return sessionStorage.getItem(tsb).substr(this.metaData, this.dataData + this.metaData);
		}

		public getMeta(tsb: string): string {
			return sessionStorage.getItem(tsb).substr(0, this.metaData);
		}
		
		public setData(tsb: string, data: string) {
			sessionStorage.setItem(tsb, this.getMeta(tsb) + data + new Array(this.dataData - data.length + 1).join('0'));
		}

		public setMeta(tsb: string, meta: string) {
			sessionStorage.setItem(tsb, "1" + meta + this.getData(tsb));
		}

		public clearBlock(tsb: string) {
			sessionStorage.setItem(tsb, "0000" + new Array(this.dataData).join('0'));
		}
		
	}
}