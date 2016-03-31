// intitalize Phazer with 400x490 window
var game = new Phaser.Game(400, 490);

var mainstate = {
  preload: function() {
    game.load.image('player', 'assets/fhazer_player_70.png');
  },
  create: function() {
    game.stage.backgroundColor = '#2e62c7';
    // start the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = game.add.sprite(100, 245, 'player');
    // player.scale.setTo(70, 70);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;

    var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacekey.onDown.add(this.jump, this);
  },
  update: function() {
    // reset if player is too higher or too low on screen
    if(this.player.y < 0 || this.player.y > 490) this.restartGame();
  },
  jump: function() {
    this.player.body.velocity.y = -350;
  },
  restartGame: function() {
    game.state.start('main');
  }
};

game.state.add('main', mainstate);
game.state.start('main');
