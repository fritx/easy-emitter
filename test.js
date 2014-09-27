var Emitter = require('./')
var assert = require('assert')

describe('easy-emitter', function(){

  it('calls', function(){

    var player = {
      hp: 100,
      stars: 3,
      alive: true
    }
    Emitter.call(player)

    player.one('die', function(){ // handle once
      this.alive = false
      this.stars -= 1
      this.off('hurt')  // clear
    })
    player.on('hurt', function(damage){
      this.hp -= damage
      if (this.hp <= 0 && this.alive) { // notify once
        this.emit('die')
      }
    })


    for (var i = 0; i < 10; i++) {
      player.emit('hurt', 20)
    }
    assert.equal(player.alive, false)
    assert.equal(player.hp, 0)
    assert.equal(player.stars, 2)

  })

  it('ons', function(){

    var obj = new Emitter()
    obj.times = 0

    obj.on('foo', function(){
      obj.times++
    })

    for (var i = 0; i < 5; i ++) { obj.emit('foo') }
    assert.equal(obj.times, 5)

  })

  it('ones', function(){

    var obj = new Emitter()
    obj.times = 0

    obj.one('foo', function(){
      obj.times++
    })

    for (var i = 0; i < 5; i ++) { obj.emit('foo') }
    assert.equal(obj.times, 1)

  })

  it('offs all', function(){

    var obj = new Emitter()
    obj.times1 = 0
    obj.times2 = 0
    obj.times3 = 0

    obj.on('foo', function(){
      obj.times1++
    })
    obj.on('foo', function(){
      obj.times2++
      if (obj.times2 >= 3) this.off('foo')
    })
    obj.on('foo', function(){
      obj.times3++
    })

    for (var i = 0; i < 5; i ++) { obj.emit('foo') }
    assert.equal(obj.times1, 3)
    assert.equal(obj.times2, 3)
    assert.equal(obj.times3, 3)

  })

  it('offs fn', function(){

    var obj = new Emitter()
    obj.times1 = 0
    obj.times2 = 0
    obj.times3 = 0

    obj.on('foo', function(){
      obj.times1++
    })
    obj.on('foo', function fn(){
      obj.times2++
      if (obj.times2 >= 3) this.off('foo', fn)
    })
    obj.on('foo', function(){
      obj.times3++
    })

    for (var i = 0; i < 5; i ++) { obj.emit('foo') }
    assert.equal(obj.times1, 5)
    assert.equal(obj.times2, 3)
    assert.equal(obj.times3, 5)

  })

})