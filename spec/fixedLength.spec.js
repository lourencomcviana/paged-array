const PagedArray= require("../bin/PagedArray");

const dummyRun =function(data,info){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(data);
    },0);
  })
  return data
}


var arr;

beforeEach(function() {
  arr=new PagedArray(30,{size:20,run:dummyRun});
});

describe("fixedlen-paging-walking", function () {

  beforeEach(function() {
    arr.load();
  });

  it("should be in the first page", function () {
    expect(arr.pageCurrent).toBe(0);
  });

  it("should read the second value", function (done) {
    arr[1].then(function(data){
      expect(data).toBe(1);
      done();
    });
    arr[0].then(function(data,info){
      expect(data).toBe(0);
      done();
    });
  });

  it("should be in the second page", function () {
    arr.next();
    expect(arr.pageCurrent).toBe(1);
  });

  it("should read the first value of the second page", function (done) {    
    arr.next();
    arr[0].then(function(data){
      expect(data).toBe(20);
      done();
    });
  });
});

describe("fixedlen-for-each", function () {
  let promise;

  it("should return all itens of the array", function (done) {
    let count=0;
    promise=arr.forEach(function(element,id) {
      
      expect(element).toBe(count);
      count++;
    }, this);

    promise.then(function(end){
      expect(count).toBe(30);
      done();
    });
  });

  it("the return of the promise must be an object", function (done) {
    promise.then(function(end){
      expect(typeof end).toBe("object");
      done();
    });
  });

  it("the last element of the last page of the array should be 29", function (done) {
    promise.then(function(end){
      expect(end[9]).toBe(29);
      done();
    });
  });
});