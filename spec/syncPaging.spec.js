const PagedArray= require("../bin/PagedArray");

const testArr=[1,2,3];
const dummyRun =function(data,val){
  return data;
}
var obj;
const dummyPageArray=function(){
  if(!obj) 
    obj=new PagedArray.default(testArr,{size:2,run:dummyRun});
  return obj;
}


describe("paging-create", function () {
  it("should create a empty array ready to be loaded", function () {
    //var product = calculator.multiply(2, 3);

    var arr=dummyPageArray();
    expect(arr.length).toBe(0);
  });
});  

describe("paging-load", function () {
  it("should show an array of two positions", function () {
    //var product = calculator.multiply(2, 3);

    var arr=dummyPageArray();
    arr.load();
    expect(arr.length).toBe(2);
  });
});  

describe("paging-next", function () {
  it("should show an array of one position", function () {
    //var product = calculator.multiply(2, 3);

    var arr=dummyPageArray();
    arr.next();
    expect(arr.length).toBe(1);
  });
});  

describe("paging-previous", function () {
  it("should show an array of two positions", function () {
    //var product = calculator.multiply(2, 3);

    var arr=dummyPageArray();

    arr.previous();
    expect(arr.length).toBe(2);
  });
});  
