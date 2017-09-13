import Promise =require( 'bluebird');

import * as ProgressBar from "progress";


interface ItemRange{
  readonly min:number,
  readonly max:number
}
interface PageInfo{
  readonly parameters:Array<any> ;
  readonly pageSize:number;
  readonly pageCurrent:number;
  readonly pageTotal:number;
  readonly pageItemRange:ItemRange;
  readonly pageStart:number;
  readonly pageEnd:number;
}


interface RunFunction{
    (parameter: any, info?:PageInfo):string |number | object | Promise<any>;
}
interface ProgressFunction{
    (data: any):void;
}

interface Options{
    [index: string]: any;
    clientPaging?:boolean,
    size?:number;
    run:RunFunction;
    //Will replace with Progress later, converting to typescript
    progress?:ProgressFunction;
}


interface Config extends Options{
   current:number;
}

function instanceOfRunFunction(object: any): object is RunFunction{
    return true;
}

//temporario
class Progress{
    constructor(fun :ProgressFunction){

    }

    start=function(le:number){};
    run=function(){};
    show=function(){};
}

export default class PagedArray extends Array implements PageInfo {

  private config :Config;
  private parameterList :Array<any> ;
  private parameterNumber:number;

  constructor(parameter :Array<any>|number ,options:Options|RunFunction) {
    super();
    this.config=<Config>PagedArray.ProcessOptions(options);

    this.config.current=0;
    if(typeof parameter=='number'){
      this.parameterNumber=<number>parameter; 
    }else{
      this.parameterList=<Array<any>>parameter;
    }
    

  }
  
  private genInfo():PageInfo{
    return {
      parameters:this.parameters,
      pageSize:this.pageSize,
      pageCurrent:this.pageCurrent,
      pageTotal:this.pageTotal,
      pageItemRange:this.pageItemRange,
      pageStart:this.pageStart,
      pageEnd:this.pageEnd
    }
  }

  static ProcessOptions(options:Options|RunFunction) :Options{
    let model:Options={
      size:100,
      clientPaging:false,
      run:undefined,
      progress:undefined,
    };
    
    if(typeof options=='function'){
      model.run=options;
    } else if(typeof options=='object'){
      options=<Options>options;

      for(let id in model){
        if(!options[id]) options[id]=model[id];
      }

      
      return options;
    }
    return model;
  }

  get parameters() {
      return this.parameterList;
  }

  get pageSize() {
      return this.config.size;
  }

  get pageCurrent() {
      return this.config.current;
  }

  get pageTotal() {
    if(this.parameterNumber)
      return this.parameterNumber;
    return Math.ceil(this.parameters.length/this.pageSize);
  }
  
  get pageItemRange() {
    let itemSize=this.pageSize*this.pageCurrent
      return{
        min:itemSize,
        max:itemSize+this.pageSize
      };
  }

  get pageStart() {
    return this.pageSize*this.pageCurrent;

  }

  get pageEnd() {
    let end=this.pageStart+this.pageSize;
    let paramLength= this.parameterNumber?this.parameterNumber:this.parameters.length;
    return end>paramLength?paramLength:end;
  }

  hasNext(){
    return (this.pageCurrent<this.pageTotal-1)  
  }

  hasPrevious(){
    return (this.pageCurrent>0)
  }
  
  next(){
    if(this.hasNext()){
      this.config.current++;
      this.load();
      return true;
    }
    return false;
  }


  previous(){
    if(this.hasPrevious()){
      this.config.current--;
      this.load();
      return true;
    }
    return false;
  }

  load(progress?:Progress|ProgressFunction){
    this.length = 0;
    if(!progress || typeof(progress)=='function')
      progress = new Progress(this.config.progress)
    progress=<Progress>progress;

    progress.start(this.pageEnd-this.pageStart);    

  
    //convert requests to match paging
    if(this.config.clientPaging){
      let result;
      if(this.parameterNumber){
        result=this.config.run(this.parameterNumber,this.genInfo())
      }else{
        result=this.config.run(this.parameterList[this.pageCurrent],this.genInfo())
      }
      let mainPromise=Promise.resolve(result);
      for(let id=0;id<this.config.size;id++){
        this.push(genPromise(id,mainPromise));
        progress.run();
      }

      function genPromise(id:number,promise:Promise<any>){
        
        return new Promise(function(accept,reject){
          promise
            .then(function(data){
              try{
                accept(data[id]);
              }catch(err){
                reject(err);
              }
            }).catch(function(err){
              reject(err);
            })
        });
      }
    }else{
      for(let idItem=this.pageStart;idItem<this.pageEnd;idItem++){
        let result:string |number | object | Promise<any>;

        try{
          if(this.parameterNumber){
            result=this.config.run(this.parameterNumber,this.genInfo())
          }else{
            result = this.config.run(this.parameterList[idItem],this.genInfo());
          }
         
        }catch(e){
          result = e;
        }

        this.push(result);
        progress.run();
      }
    }
  }

  forEach(callbackfn:any,thisArg?:any): Promise<any>{
    
    function recursivePromise(arr:PagedArray): Promise<any>{
      //walk from page to page
      return Promise.all(arr)
      .then(function(data){
        //data is not a paged-array, it is a normal array
        data.forEach(callbackfn,thisArg);
        if(arr.next()){
          return recursivePromise(arr);
        }
        return data;
      });
    }
    this.config.current=0;
    //run all parameters
    let progress = new Progress(this.config.progress);

    progress.start(this.parameters.length); 
    this.load();

    
    return recursivePromise(this);
  };
}