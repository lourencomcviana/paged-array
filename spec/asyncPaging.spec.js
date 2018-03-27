const PagedArray= require("../bin/PagedArray");

const dummyRun =function(data,val){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(data);
    },0);
  })
  return data
}


var arr;

beforeEach(function() {
  arr=new PagedArray.default([1,2,3],{size:2,run:dummyRun});
});

describe("paging-create", function () {
  it("should create a new instance of the array", function () {
    expect(arr.constructor.name).toBe("PagedArray");
  });

  it("should load the first page of the array", function () {
    expect(arr.length).toBe(0);
    arr.load();
    expect(arr.length).toBe(2);
  });
});

describe("paging-walking", function () {

  beforeEach(function() {
    arr.load();
  });

  it("should be in the first page", function () {
    expect(arr.pageCurrent).toBe(0);
  });
  
  it("should read the second value", function (done) {
    arr[1].then(function(data){
      expect(data).toBe(2);
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
      expect(data).toBe(3);
      done();
    });
  });
});

describe("for-each", function () {
  let promise;

  it("should return all itens of the array", function (done) {
    let count=0;
    promise=arr.forEach(function(element,id) {
      count++;
      expect(element).toBe(count);
    }, this);

    promise.then(function(end){
      expect(count).toBe(3);
      done();
    });
  });

  it("the last page of the array should be [3]", function (done) {
    promise.then(function(end){
      expect(typeof end).toBe("object");
      expect(end[0]).toBe(3);
      done();
    });
  });
  
});