//thanks to theses guys https://anapioficeandfire.com/About for such awesome api
//api documentation https://anapioficeandfire.com/Documentation


//consume game of thrones api. Following its paging rules
//at the time of this example, there was 2138 characters registered.
//The api supports paging of 50 items max

  
/* TO DO
import  PagedArray from "./PagedArray";
import * as http from "http";

http.get("https://anapioficeandfire.com/api/characters")
var arr=new PagedArray(["maria","123","maria","123","maria","123","maria","123"],{
    size:2,
    run:function(data,info){

        return data+" - "+info.pageCurrent;
    }
});

arr.forEach(function(item:any,id:any){
    console.log(item);

});
*/