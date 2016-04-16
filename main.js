// intitalize Phazer with 400x490 window
var game = new Phaser.Game(400, 490);

var mainstate = {
  preload: function() {
    game.load.image('player', 'assets/fhazer_player_50.png');
    game.load.image('wall', 'assets/obstacle.png');
    game.load.audio('jump', 'assets/jump2.wav');
    game.load.audio('hit', 'assets/hitWall.wav');
    game.load.audio('point', 'assets/point.wav');
  },


  create: function() {
    // moble platfrom targeting
    if(!game.device.desktop) {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = '#2e62c7';

    // start the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // sound stuff
    this.jumpSound = game.add.audio('jump');
    this.hitWallSound = game.add.audio('hit');
    this.pointSound = game.add.audio('point');

    // player stuff
    this.player = game.add.sprite(100, 245, 'player');
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    // changes anchor so animation looks better
    this.player.anchor.setTo(-0.2, 0.5);

    // wall stuff
    this.walls = game.add.group();
    // add a wall every 1.5 seconds
    this.timer = game.time.events.loop(1500, this.addRowWallBlock, this);

    // score
    this.score = -1;
    this.labelScore = game.add.text(20, 20, '0',
      {font: '30px Helvetica', fill: '#ffffff'});

    // controls
    var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacekey.onDown.add(this.jump, this);
    // mobile
    game.input.onDown.add(this.jump, this);
  },


  update: function() {
    // reset if player is too higher or too low on screen
    if(this.player.y < 0 || this.player.y > 490) this.restartGame();
    // reset on collision
    game.physics.arcade.overlap(this.player, this.walls, this.hitWall, null, this);

    // animation to rotate downward
    if(this.player.angle < 20) this.player.angle += 1;
  },

  hitWall: function() {
    if(!this.player.alive) return;

    this.hitWallSound.play();

    // kill player
    this.player.alive = false;
    // stop walls from appearing
    game.time.events.remove(this.timer);
    // stop all wall movement
    this.walls.forEach(function(w) {
      w.body.velocity = 0;
    }, this);
  },


  jump: function() {
    if(!this.player.alive) return;

    this.jumpSound.play();
    this.player.body.velocity.y = -350;

    // creating an animation on the player
    var animation = game.add.tween(this.player);
    // change angle to -20 degrees in 100 milliseconds
    animation.to({angle: -20}, 100);
    // start animation
    animation.start();
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
      if(i != gap && i != gap + 1 && i != gap + 2) {
        this.addOneWallBlock(400, i * 60 + 10);
      }
    }
    // score if player is still alive when next wall spawns
    this.score += 1;
    if(this.score > 0) {
      this.labelScore.text = this.score;
      this.pointSound.play();
    }
  }
};

game.state.add('main', mainstate);
game.state.start('main');
