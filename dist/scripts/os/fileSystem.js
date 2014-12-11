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
            this.status = "loaded";
        };

        FileSystem.prototype.krnFile = function () {
        };

        FileSystem.prototype.init = function () {
            for (var t = 0; t <= this.track - 1; t++) {
                for (var s = 0; s <= this.sector - 1; s++) {
                    for (var b = 0; b <= this.block - 1; b++) {
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
        return FileSystem;
    })(TSOS.DeviceDriver);
    TSOS.FileSystem = FileSystem;
})(TSOS || (TSOS = {}));
