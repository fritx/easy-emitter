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

})