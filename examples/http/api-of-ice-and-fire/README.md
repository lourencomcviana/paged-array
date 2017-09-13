# Api of ice and fire

Based on the cool api of ice and fire: https://anapioficeandfire.com/


## Code
Installation. request-promise is a good module to make http requests that return promises.
```
npm install request-promise
npm install paged-array
```

First, import the modules

``` javascript
const PagedArray  = require("paged-array");
const request  = require('request-promise');;
```

Then, we make the configuration of our array.
``` javascript
const baseUrl='https://www.anapioficeandfire.com/api/characters'
const options ={
  //it means that a external source control the paging. 
  externalPaging:true,
  //the end result of the external source is an array of 50 positions
  size:50,
  //runner method. It will make a request for each page and parse the result to json
  run:function(param,info){
    return request(
      baseUrl+
      '?pageSize='+info.pageSize+
      '&page='+info.pageCurrent+1
      )
    .then(function(body){
      return JSON.parse(body);
    })
    .catch(function(err){
      console.log(err);
    })
  }
}
```

Them, we create the array with the options we made before. Note that instead of an array of parameters, we are passing the number "2". By doing that we are saying that we have TWO pages. In our example it will query for page one and two in the api of ice and fire.
``` javascript
let array = new PagedArray(2,options);
```

the return can be seen in:

``` javascript
//load current page (page one)
array.load();
console.log(array[0].data);
console.log(array[25].data);
console.log(array[49].data);

//next page
array.next()
console.log(array[0].data);
console.log(array[25].data);
console.log(array[49].data);
```

``` javascript
//it will show all characters from page one and two
array.forEach(function(data){
  console.log(data);
});

```
## Run
```
node examples/http/api-of-ice-and-fire/client.js
```