"use strict";
// import { sayHello } from "./PagedArray";
Object.defineProperty(exports, "__esModule", { value: true });
// console.log(sayHello("TypeScript"));
const PagedArray_1 = require("./PagedArray");
var arr = new PagedArray_1.default(["maria", "123", "maria", "123", "maria", "123", "maria", "123"], {
    size: 2,
    run: function (data, info) {
        return data + " - " + info.pageCurrent;
    }
});
arr.forEach(function (item, id) {
    console.log(item);
});

//# sourceMappingURL=main.js.map
