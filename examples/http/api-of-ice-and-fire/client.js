//thanks to theses guys https://anapioficeandfire.com/About for such awesome api
//api documentation https://anapioficeandfire.com/Documentation


//consume game of thrones api. Following its paging rules
//at the time of this example, there was 2138 characters registered.
//The api supports paging of 50 items max
const PagedArray  =require("../../../bin/PagedArray").default;
const request  = require('request-promise');;

const options ={
  size:50,
  clientPaging:true,
  run:function(param,info){

    return request('https://www.anapioficeandfire.com/api/characters?pageSize='+info.pageSize+'&page='+info.pageCurrent+1)
    .then(function(body){
      return JSON.parse(body);
    })
    .catch(function(err){
      console.log(err);
    })
  }
}

//load two pages
let array = new PagedArray(2,options);

//load first page with 50 characters
array.load();

show(array[0],1)
show(array[1],1)
show(array[49],1)

//load second page with 50 characters
array.next();
show(array[0],2)

function show(promisse,page){
  promisse.then(function(data){
    console.log((data.name?data.name:data.aliases)+' p: '+page)
  });
}