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
			this.dataData = 60;
			//I sure hope this works like the keyboard driver
			super(this.krnFSDriverEntry, this.krnFile);
		}

		public krnFSDriverEntry(): void {
			this.status = "loaded";
		}

		public krnFile(): void {

		}

		public init(): void {
			for (var t = 0; t <= this.track - 1; t++){
              	for (var s = 0; s <= this.sector - 1; s++){
                	for(var b = 0; b <= this.block - 1; b++){


					}
				}
			}
		}

		public hexToString(hex:string) {
		    var str = '';
		    for (var i = 0; i < hex.length; i += 2)
		        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		    return str;
		}
		
		public stringToHex(str:string) {
			var arr = [];
		  	for (var i = 0, l = str.length; i < l; i ++) {
			    var hex = Number(str.charCodeAt(i)).toString(16);
			    arr.push(hex);
			}
		  	return arr.join('');
		}
		
	}
}