var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    var FileSystem = (function (_super) {
        __extends(FileSystem, _super);
        function FileSystem() {
            //These are the places where the string of data blob will get chopped up (substringed)
            //Because magic numbers are Satan
            this.track = 4;
            this.sector = 8;
            this.block = 8;
            this.metaData = 4;
            this.dataData = 120;

            //I sure hope this works like the keyboard driver
            _super.call(this, this.krnFSDriverEntry, this.krnFile);
        }
        FileSystem.prototype.krnFSDriverEntry = function () {
            _FileNames = new Array();
            this.status = "loaded";
            this.init();
        };

        FileSystem.prototype.krnFile = function (args) {
        };

        FileSystem.prototype.init = function () {
            debugger;
            var filler = new Array(this.dataData + this.metaData + 1).join('0');
            sessionStorage.setItem("000", "1000" + this.hexToString(alanQuote));
            for (var t = 0; t <= this.track - 1; t++) {
                for (var s = 0; s <= this.sector - 1; s++) {
                    for (var b = 0; b <= this.block - 1; b++) {
                        if (t.toString() + s.toString() + b.toString() !== "000") {
                            sessionStorage.setItem(t.toString() + s.toString() + b.toString(), filler);
                        }
                    }
                }
            }

            TSOS.Control.displayDingle();
        };

        FileSystem.prototype.hexToString = function (hex) {
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        };

        FileSystem.prototype.stringToHex = function (str) {
            var arr = [];
            for (var i = 0, l = str.length; i < l; i++) {
                var hex = Number(str.charCodeAt(i)).toString(16);
                arr.push(hex);
            }
            return arr.join('');
        };

        FileSystem.prototype.diskIsFull = function () {
            for (var t = 0; t <= this.track - 1; t++) {
                for (var s = 0; s <= this.sector - 1; s++) {
                    for (var b = 0; b <= this.block - 1; b++) {
                        if (this.getMeta(t.toString() + s.toString() + b.toString()).substr(0, 1) === "0")
                            return false;
                    }
                }
            }

            return true;
        };

        FileSystem.prototype.createFile = function (filename) {
            debugger;
            if (filename in _FileNames) {
                _StdOut.putText("This file already exists.");
                return false;
            }

            if (!this.diskIsFull()) {
                var nextTSB = this.nextEmptyTSB();

                _FileNames[filename] = nextTSB;
                this.setMeta(nextTSB, "000");
                this.setData(nextTSB, this.stringToHex(filename));
                _StdOut.putText("File creation successful.  Maybe.");
                TSOS.Control.displayDingle();
                return true;
            } else
                return false;
        };

        FileSystem.prototype.writeFile = function (filename, data) {
            debugger;
            var filenameTSB = _FileNames[filename];

            //check if file is already written to, then overwrite if needed
            var filenamePointer = this.getMeta(filenameTSB).substr(1);

            var dataHex = this.stringToHex(data);

            if (this.diskIsFull())
                return false;

            //if the filename is not pointing to anything, it hasn't been written to yet
            if (filenamePointer === "000") {
                var nextTSB = this.nextEmptyTSB();

                this.setMeta(filenameTSB, nextTSB);

                if (dataHex.length > this.dataData)
                    this.distributeData(filename, data);
                else
                    this.setMeta(nextTSB, "000");
                this.setData(nextTSB, dataHex);
            } else {
                //file has already been written to, overwrite
                var fileMeta = this.getMeta(filenameTSB).substr(1);
                if (dataHex.length > this.dataData)
                    this.distributeDataOver(filename, data);
                else
                    this.setData(fileMeta, dataHex);
            }
            TSOS.Control.displayDingle();
            return true;
        };

        FileSystem.prototype.readFile = function (filename) {
            var filenameTSB = _FileNames[filename];
            var fileDataTSB = this.getMeta(filenameTSB).substr(1);
            var fileData = this.getData(fileDataTSB);
            var output = this.hexToString(fileData);
            _StdOut.putText(output);

            return true;
        };

        FileSystem.prototype.deleteFile = function (filename) {
            debugger;
            var filenameTSB = _FileNames[filename];
            var filePointer = this.getMeta(filenameTSB).substr(1);
            this.setData(filePointer, "0");
            return true;
        };

        FileSystem.prototype.distributeData = function (filename, data) {
            debugger;
            var filenameTSB = _FileNames[filename];
            var dataHex = this.stringToHex(data);

            while (dataHex.length > this.dataData) {
                var nextTSB = this.nextEmptyTSB();
                this.setMeta(nextTSB, this.nextEmptyTSB());
                this.setData(nextTSB, dataHex.slice(0, this.dataData + 1));
            }

            nextTSB = this.nextEmptyTSB();
            this.setMeta(nextTSB, "000");
            this.setData(nextTSB, dataHex);
        };

        FileSystem.prototype.distributeDataOver = function (filename, data) {
            debugger;
            var filenameTSB = _FileNames[filename];
            var dataHex = this.stringToHex(data);

            while (dataHex.length > this.dataData) {
                var nextTSB = this.getMeta(filenameTSB.substr(1));
                this.setData(nextTSB, dataHex.slice(0, this.dataData + 1));
                filenameTSB = nextTSB;
            }
        };

        FileSystem.prototype.nextEmptyTSB = function () {
            for (var t = 0; t <= this.track - 1; t++) {
                for (var s = 0; s <= this.sector - 1; s++) {
                    for (var b = 0; b <= this.block - 1; b++) {
                        if (sessionStorage.getItem(t.toString() + s.toString() + b.toString()).substr(0, 1) === "0")
                            return t.toString() + s.toString() + b.toString();
                    }
                }
            }
        };

        FileSystem.prototype.getData = function (tsb) {
            return sessionStorage.getItem(tsb).substr(this.metaData, this.dataData + this.metaData);
        };

        FileSystem.prototype.getMeta = function (tsb) {
            return sessionStorage.getItem(tsb).substr(0, this.metaData);
        };

        FileSystem.prototype.setData = function (tsb, data) {
            sessionStorage.setItem(tsb, this.getMeta(tsb) + data + new Array(this.dataData - data.length + 1).join('0'));
        };

        FileSystem.prototype.setMeta = function (tsb, meta) {
            sessionStorage.setItem(tsb, "1" + meta + this.getData(tsb));
        };
        return FileSystem;
    })(TSOS.DeviceDriver);
    TSOS.FileSystem = FileSystem;
})(TSOS || (TSOS = {}));
