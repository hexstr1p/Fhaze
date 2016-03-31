// intitalize Phazer with 400x490 window
var game = new Phaser.Game(400, 490);

var mainstate = {
  preload: function() {
    game.load.image('player', 'assets/fhazer_player_50.png');
    game.load.image('wall', 'assets/obstacle.png');
  },
  create: function() {
    game.stage.backgroundColor = '#2e62c7';
    // start the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // player stuff
    this.player = game.add.sprite(100, 245, 'player');
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    // other stuff
    this.walls = game.add.group();
    // add a wall every 1.5 seconds
    this.timer = game.time.events.loop(1500, this.addRowWallBlock, this);
    // controls
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
  },
  addOneWallBlock: function(x, y) {
    var wall = game.add.sprite(x, y, 'wall');
    this.walls.add(wall);
    game.physics.enable(wall);
    wall.body.velocity.x = -200;
    // auto destroy wall when it leaves
    wall.checkWorldBounds = true;
    wall.outOfBoundsKill = true;
  },
  addRowWallBlock: function() {
    var gap = Math.floor(Math.random() * 5) + 1;
    for(var i = 0; i < 8; ++i) {
      if(i != gap && i != gap + 1) {
        this.addOneWallBlock(400, i * 60 + 10);
      }
    }
  }
};

game.state.add('main', mainstate);
game.state.start('main');
