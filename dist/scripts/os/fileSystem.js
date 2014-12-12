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
            this.dataData = 60;

            //I sure hope this works like the keyboard driver
            _super.call(this, this.krnFSDriverEntry, this.krnFile);
        }
        FileSystem.prototype.krnFSDriverEntry = function () {
            _FileNames = new Array();
            this.status = "loaded";
        };

        FileSystem.prototype.krnFile = function () {
        };

        FileSystem.prototype.init = function () {
            var filler = new Array(this.dataData + this.metaData + 1).join('0');
            sessionStorage.setItem("000", alanQuote);
            for (var t = 0; t <= this.track - 1; t++) {
                for (var s = 0; s <= this.sector - 1; s++) {
                    for (var b = 0; b <= this.block - 1; b++) {
                        if (t.toString() + s.toString() + b.toString() !== "000") {
                            sessionStorage.setItem(t.toString() + s.toString() + b.toString(), filler);
                        }
                    }
                }
            }
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
                        if (sessionStorage.getItem(t.toString() + s.toString() + b.toString()).substr(0, 1) === "0")
                            return true;
                    }
                }
            }

            return false;
        };

        FileSystem.prototype.createFile = function (filename) {
            if (!this.diskIsFull()) {
                return true;
            } else
                return false;
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
        return FileSystem;
    })(TSOS.DeviceDriver);
    TSOS.FileSystem = FileSystem;
})(TSOS || (TSOS = {}));
