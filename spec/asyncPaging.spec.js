const PagedArray= require("../bin/PagedArray");

const testArr=[1,2,3];
const dummyRun =function(data,val){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(data);
    },1000);
  })
  return data
}
var obj;
const dummyPageArray=function(){
  if(!obj) 
    obj=new PagedArray.default(testArr,{size:2,run:dummyRun});
  return obj;
}


describe("paging-create", function () {
  it("should create a empty array ready to be loaded", function (done) {
    //var product = calculator.multiply(2, 3);
 
    var arr=dummyPageArray();
    arr.load();
    arr[0].then(function(data){
      expect(data).toBe(1);
      done();
    });
  });
});  
