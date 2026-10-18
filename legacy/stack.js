var Stack = function(maxSize){
    this.maxSize = maxSize;
    this.stack = [];
    this.length = 0;
};

Stack.prototype = {
  push: function(value){
    if (this.maxSize && (this.length == this.maxSize)){
      this.stack.shift();
      --this.length;
    }
    this.stack.push(value);
    ++this.length;
  },
  pop: function(){
    if (this.length){
      --this.length;
      return this.stack.pop();
    }
    return undefined;
  },
  peek: function(){
    return this.stack[this.length-1];
  },
  size: function(){
    return this.length;
  }
};
