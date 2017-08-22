//thanks to theses guys https://anapioficeandfire.com/About for such awesome api
//api documentation https://anapioficeandfire.com/Documentation


//consume game of thrones api. Following its paging rules
//at the time of this example, there was 2138 characters registered.
//The api supports paging of 50 items max
const PagedArray  =require("../../../bin/PagedArray").default;
const request  = require('request-promise');;
let params=[];

for(let id =1;id<=200;id++ ){
  params.push(id);
}

const options ={
  size:50,
  run:function(id){
    return request('https://www.anapioficeandfire.com/api/characters/'+id)
    .then(function(body){
      return JSON.parse(body);
    })
    .catch(function(err){
      console.log(err);
    })
  }
}

let array = new PagedArray(params,options);

//load first page with 50 characters
array.load();
show(array[0])

//load second page with 50 characters
array.next();
show(array[0])

function show(promisse){
  promisse.then(function(data){
    console.log(data.name?data.name:data.aliases)
  });
}