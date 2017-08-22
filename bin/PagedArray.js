"use strict";
// export function sayHello(name: string) {
//     return `Hello from ${name}`;
// }
Object.defineProperty(exports, "__esModule", { value: true });
// export function another (name: string) {
//     return `Hasassaas ${name}`;
// }
const Promise = require("bluebird");
function instanceOfRunFunction(object) {
    return true;
}
//temporario
class Progress {
    constructor(fun) {
        this.start = function (le) { };
        this.run = function () { };
        this.show = function () { };
    }
}
class PagedArray extends Array {
    constructor(parameterList, options) {
        super();
        this.config = PagedArray.ProcessOptions(options);
        this.config.current = 0;
        this.parameterList = parameterList;
    }
    genInfo() {
        return {
            parameters: this.parameters,
            pageSize: this.pageSize,
            pageCurrent: this.pageCurrent,
            pageTotal: this.pageTotal,
            pageItemRange: this.pageItemRange,
            pageStart: this.pageStart,
            pageEnd: this.pageEnd
        };
    }
    static ProcessOptions(options) {
        let model = {
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
    }
    get parameters() {
        return this.parameterList;
    }
    get pageSize() {
        return this.config.size;
    }
    get pageCurrent() {
        return this.config.current;
    }
    get pageTotal() {
        return Math.ceil(this.parameters.length / this.pageSize);
    }
    get pageItemRange() {
        let itemSize = this.pageSize * this.pageCurrent;
        return {
            min: itemSize,
            max: itemSize + this.pageSize
        };
    }
    get pageStart() {
        return this.pageSize * this.pageCurrent;
    }
    get pageEnd() {
        let end = this.pageStart + this.pageSize;
        return end > this.parameters.length ? this.parameters.length : end;
    }
    hasNext() {
        return (this.pageCurrent < this.pageTotal - 1);
    }
    hasPrevious() {
        return (this.pageCurrent > 0);
    }
    next() {
        if (this.hasNext()) {
            this.config.current++;
            this.load();
            return true;
        }
        return false;
    }
    previous() {
        if (this.hasPrevious()) {
            this.config.current--;
            this.load();
            return true;
        }
        return false;
    }
    load(progress) {
        this.length = 0;
        if (!progress || typeof (progress) == 'function')
            progress = new Progress(this.config.progress);
        progress = progress;
        progress.start(this.pageEnd - this.pageStart);
        for (let idItem = this.pageStart; idItem < this.pageEnd; idItem++) {
            let result;
            try {
                result = this.config.run(this.parameterList[idItem], this.genInfo()); //fs.readprametersync(this.prameters[idItem]);
            }
            catch (e) {
                result = e;
            }
            this.push(result);
            progress.run();
        }
    }
    forEach(callbackfn, thisArg) {
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
        let progress = new Progress(this.config.progress);
        progress.start(this.parameters.length);
        this.load();
        recursivePromise(this);
    }
    ;
}
exports.default = PagedArray;

//# sourceMappingURL=PagedArray.js.map
