"use strict";
// export function sayHello(name: string) {
//     return `Hello from ${name}`;
// }
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// export function another (name: string) {
//     return `Hasassaas ${name}`;
// }
var Promise = require("bluebird");
function instanceOfRunFunction(object) {
    return true;
}
//temporario
var Progress = (function () {
    function Progress(fun) {
        this.start = function (le) { };
        this.run = function () { };
        this.show = function () { };
    }
    return Progress;
}());
var PagedArray = (function (_super) {
    __extends(PagedArray, _super);
    function PagedArray(parameterList, options) {
        var _this = _super.call(this) || this;
        _this.config = PagedArray.ProcessOptions(options);
        _this.config.current = 0;
        _this.parameterList = parameterList;
        return _this;
    }
    PagedArray.prototype.genInfo = function () {
        return {
            parameters: this.parameters,
            pageSize: this.pageSize,
            pageCurrent: this.pageCurrent,
            pageTotal: this.pageTotal,
            pageItemRange: this.pageItemRange,
            pageStart: this.pageStart,
            pageEnd: this.pageEnd
        };
    };
    PagedArray.ProcessOptions = function (options) {
        var model = {
            size: 100,
            run: undefined,
            progress: undefined,
        };
        if (typeof options == 'function') {
            model.run = options;
        }
        else if (typeof options == 'object') {
            options = options;
            for (var id in model) {
                if (!options[id])
                    options[id] = model[id];
            }
            return options;
        }
        return model;
    };
    Object.defineProperty(PagedArray.prototype, "parameters", {
        get: function () {
            return this.parameterList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedArray.prototype, "pageSize", {
        get: function () {
            return this.config.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedArray.prototype, "pageCurrent", {
        get: function () {
            return this.config.current;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedArray.prototype, "pageTotal", {
        get: function () {
            return Math.ceil(this.parameters.length / this.pageSize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedArray.prototype, "pageItemRange", {
        get: function () {
            var itemSize = this.pageSize * this.pageCurrent;
            return {
                min: itemSize,
                max: itemSize + this.pageSize
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedArray.prototype, "pageStart", {
        get: function () {
            return this.pageSize * this.pageCurrent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedArray.prototype, "pageEnd", {
        get: function () {
            var end = this.pageStart + this.pageSize;
            return end > this.parameters.length ? this.parameters.length : end;
        },
        enumerable: true,
        configurable: true
    });
    PagedArray.prototype.hasNext = function () {
        return (this.pageCurrent < this.pageTotal - 1);
    };
    PagedArray.prototype.hasPrevious = function () {
        return (this.pageCurrent > 0);
    };
    PagedArray.prototype.next = function () {
        if (this.hasNext()) {
            this.config.current++;
            this.load();
            return true;
        }
        return false;
    };
    PagedArray.prototype.previous = function () {
        if (this.hasPrevious()) {
            this.config.current--;
            this.load();
            return true;
        }
        return false;
    };
    PagedArray.prototype.load = function (progress) {
        this.length = 0;
        if (!progress || typeof (progress) == 'function')
            progress = new Progress(this.config.progress);
        progress = progress;
        progress.start(this.pageEnd - this.pageStart);
        for (var idItem = this.pageStart; idItem < this.pageEnd; idItem++) {
            var result = void 0;
            try {
                result = this.config.run(this.parameterList[idItem], this.genInfo()); //fs.readprametersync(this.prameters[idItem]);
            }
            catch (e) {
                result = e;
            }
            this.push(result);
            progress.run();
        }
    };
    PagedArray.prototype.forEach = function (callbackfn, thisArg) {
        function recursivePromise(arr) {
            //walk from page to page
            Promise.all(arr)
                .then(function (data) {
                data.forEach(callbackfn, thisArg);
                if (arr.next()) {
                    recursivePromise(arr);
                }
            });
        }
        this.config.current = 0;
        //run all parameters
        var progress = new Progress(this.config.progress);
        progress.start(this.parameters.length);
        this.load();
        recursivePromise(this);
    };
    ;
    return PagedArray;
}(Array));
exports.default = PagedArray;

//# sourceMappingURL=PagedArray.js.map
