;(function(){

  function Emitter(){
    if (typeof this._handlers !== 'undefined') {
      throw new Error('namespace conflict')
    }
    this._handlers = {}

    if (typeof this.emit !== 'function') { // auto apply prototype
      for (var k in Emitter.prototype) {
        this[k] = Emitter.prototype[k]
      }
    }
  }

  Emitter.prototype.on = function(key, fn){
    if (!this._handlers[key]) {
      this._handlers[key] = []
    }
    this._handlers[key].push(fn)
    return this
  }
  Emitter.prototype.one = function(key, fn){
    fn._one = true  // one flag
    return this.on(key, fn)
  }
  Emitter.prototype.off = function(key, fn){
    if (arguments.length === 1) {
      delete this._handlers[key]  // clear all
    } else if (this._handlers[key]) {
      var arr = this._handlers[key]
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === fn) {
          arr.splice(i, 1)
          break
        }
      }
    }
    return this
  }

  Emitter.prototype.emit = function(key /*, args*/){
    if (this._handlers[key]) {
      var _slice = Array.prototype.slice
      var args = _slice.call(arguments, 1)
      var arr = this._handlers[key]
      var _arr = arr.concat() // clone
      for (var i = 0; i < _arr.length; i++) {
        _arr[i].apply(this, args)
        if (_arr[i]._one) arr.splice(i, 1)
      }
    }
    return this
  }
  

  if (typeof window === 'object') { // browser
    window.EasyEmitter = Emitter
  } else {  // node
    module.exports = Emitter
  }

})()