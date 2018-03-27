"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
let x = require('../package-lock.json');
console.log(x);
function instanceOfRunFunction(object) {
    return true;
}
class PagedArray extends Array {
    constructor(parameter, options) {
        super();
        this.config = PagedArray.ProcessOptions(options);
        this.config.current = 0;
        if (typeof parameter == 'number') {
            this.parameterLength = parameter;
        }
        else {
            this.parameterList = parameter;
        }
    }
    info() {
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
            clientPaging: false,
            run: undefined
        };
        if (typeof options == 'function') {
            model.run = options;
        }
        else if (typeof options == 'object') {
            options = options;
            for (let id in model) {
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
    get totalItens() {
        return this.parameterLength ? this.parameterLength : this.parameterList.length;
    }
    get pageSize() {
        return this.config.size;
    }
    get pageCurrent() {
        return this.config.current;
    }
    get pageTotal() {
        return Math.ceil(this.totalItens / this.pageSize);
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
        let paramLength = this.parameterLength ? this.parameterLength : this.parameters.length;
        return end > paramLength ? paramLength : end;
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
    goTo(pageNumber) {
        if (pageNumber > 0 && pageNumber < this.pageTotal - 1) {
            this.config.current = pageNumber;
            this.load();
            return true;
        }
        return false;
    }
    load() {
        this.length = 0;
        //convert requests to match paging
        if (this.config.clientPaging) {
            let result;
            if (this.parameterLength) {
                result = this.config.run(this.pageCurrent, this.info());
            }
            else {
                result = this.config.run(this.parameterList[this.pageCurrent], this.info());
            }
            let mainPromise = Promise.resolve(result);
            for (let id = 0; id < this.config.size; id++) {
                this.push(genPromise(id, mainPromise));
            }
            function genPromise(id, promise) {
                return new Promise(function (accept, reject) {
                    promise
                        .then(function (data) {
                        try {
                            accept(data[id]);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            }
        }
        else {
            for (let idItem = this.pageStart; idItem < this.pageEnd; idItem++) {
                let result;
                try {
                    if (this.parameterLength) {
                        result = this.config.run(idItem, this.info());
                    }
                    else {
                        result = this.config.run(this.parameterList[idItem], this.info());
                    }
                }
                catch (e) {
                    result = e;
                }
                this.push(result);
            }
        }
    }
    forEach(callbackfn, thisArg) {
        function recursivePromise(arr) {
            //walk from page to page
            let x = arr;
            return Promise.all(arr)
                .then(function (data) {
                function callBackInterceptor(value, index, array
                    //callbackfn:(value: T, index: number, array: T[],info?:PageInfo) => void){
                ) {
                    callbackfn(value, index, array, arr.info());
                }
                //data is not a paged-array, it is a normal array
                data.forEach(callBackInterceptor, thisArg);
                if (arr.next()) {
                    return recursivePromise(arr);
                }
                return data;
            });
        }
        this.config.current = 0;
        this.load();
        return recursivePromise(this);
    }
    ;
}
exports.default = PagedArray;

//# sourceMappingURL=PagedArray.js.map
