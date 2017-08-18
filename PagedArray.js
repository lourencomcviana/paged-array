(function(){
   // var Progress = require("./Progress");
    var Promise = require("bluebird");
    
    var sizeSymbol = Symbol("size of the page");
    var currentSymbol= Symbol("current page");
    var runSymbol= Symbol("function that recieves a parameter");
    var parameterSymbol= Symbol("list of entrys used by the runner passed");
    
    var progressSymbol = Symbol("progress report callback");
    
    
    class PagedArray extends Array {
      constructor(parameterList,options) {
        super();
        options=PagedArray.options(options);
  
        if(!options.run || typeof options.run!='function'){
          throw new TypeError("Must define a runner method");
        }
  
        this[sizeSymbol]=options.size;
        this[currentSymbol]=0;
        this[runSymbol]=options.run;
        this[parameterSymbol]=parameterList;
        
        this[progressSymbol]=options.progress;
      }
  
      static options(options) {
        let model={
          size:100,
          run:undefined,
          progress:undefined,
        };
        
        if(typeof options=='function'){
          model.run=options;
        } else if(typeof options=='object'){
          for(var id in model){
            if(!options[id]) options[id]=model[id];
          }
          return options;
        }
        return model;
      }
  
      get prameters() {
          return this[parameterSymbol];
      }

      get pageSize() {
          return this[sizeSymbol];
      }
       get pageCurrent() {
          return this[currentSymbol];
      }
      get pageTotal() {
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
        return end>this.parameters.length?this.parameters.length:end;
      }
  
      hasNext(){
        return (this.pageCurrent<this.pageTotal-1)
      }
      hasPrevious(){
        return (this.pageCurrent>0)
      }
      next(){
        if(this.hasNext()){
          this[currentSymbol]++;
          this.load();
          return true;
        }
        return false;
      }
  
  
      previous(){
        if(this.hasPrevious()){
          this[currentSymbol]--;
          this.load();
          return true;
        }
        return false;
      }
  
      load(progress){
        this.length = 0;
        if(!progress)
          progress = new Progress(this[progressSymbol])
        
        progress.start(this.pageEnd-this.pageStart);    
  
        for(let idItem=this.pageStart;idItem<this.pageEnd;idItem++){
          let result;
  
          try{
            result =   this[runSymbol](this.prameters[idItem]);//fs.readprametersync(this.prameters[idItem]);
          }catch(e){
            result = e;
          }
  
  
          this.push(result);
          progress.run();
        }
      }
  
      forEach(callbackfn,thisArg){
        
        function recursivePromise(arr){
          //walk from page to page
          Promise.all(arr)
          .then(function(data){
            data.forEach(callbackfn,thisArg)
            if(arr.next()){
              recursivePromise(arr);
            }
          });
        }
        this[currentSymbol]=0;
        //run all parameters
        let progress = new Progress(this.parameters.length);
        this.load();

        
        recursivePromise(this);
      };
    }
  
    module.exports=PagedArray;
  })()
  
  