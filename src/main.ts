// import { sayHello } from "./PagedArray";

// console.log(sayHello("TypeScript"));

import  PagedArray from "./PagedArray";

var arr=new PagedArray(["maria","123","maria","123","maria","123","maria","123"],{
    size:2,
    run:function(data,info){

        return data+" - "+info.pageCurrent;
    }
});

arr.forEach(function(item:any,id:any){
    console.log(item);

});