"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	// This creates an object of Phaser Game, defines the screen size (w, h), and
	// gives the designations of the all-important Preload,
	// Create, and Update functions. We'll be looking at those next...

	// but first let's make some vars

	var walls; // these are gonna be... you can't walk through these.
	var playerFriend; // hello, there!
	var playerGhost; // boo!
	var glowyThings; // you want these
	var gates;

	var hitWall; // collisons lol
	var ghostHitWall;
	var hitGate;
	var cursors; // user input
	var music;

	var glowyCollide;
	var glowyGhostCollide;

	// this functions loads all assets into the game as present data
	function preload() {
		game.load.image('sky_bg', 'assets/sky.png');
		game.load.image('friend', 'assets/partialFriend.png');
		game.load.image('glowy', 'assets/partialGlowy.png');
		game.load.image('ghost', 'assets/partialGhost.png');
		game.load.image('wall', 'assets/wall.png');
		game.load.image('gate', 'assets/partialGate.png');

		game.load.audio('pumpupthejams', 'assets/kickupthejam.mp3');
	}

	// Say, hey... you can do anything. Let's make a world~
	function create() {
		game.add.sprite(24, 22, 'glowy');

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.image(0, 0, 'sky_bg');

		playerFriend = game.add.sprite(32, game.world.height - 150, 'friend');
		game.physics.arcade.enable(playerFriend);
		playerFriend.enableBody = true;
		//player.body.bounce.y = 0.2;
		//player.body.gravity.y = 300;
		playerFriend.body.collideWorldBounds = true;

		playerGhost = game.add.sprite(200, 300, 'ghost');
		game.physics.arcade.enable(playerGhost);
		playerGhost.enableBody = true;
		playerGhost.body.collideWorldBounds = true;

		//player.animations.add('left', [0, 1, 2, 3], 10, true); // 10 fps, loop = true;
		//player.animations.add('right', [5, 6, 7, 8], 10, true);

		// ello am i error

		walls = game.add.group();
		gates = game.add.group();
		walls.enableBody = true; // enables physics
		gates.enableBody = true;
		//ground = walls.create(0, game.world.height - 64, 'ground');
		//ground.scale.setTo(2, 2); // scale it properly (it too small)
		//walls.body.immovable = true; // so you won't take the ground with you =P
		var anWall = walls.create(0, game.world.height - 64, 'wall');
		anWall.body.immovable = true;
		var anotherWall = walls.create(300, 100, 'wall');
		anotherWall.body.immovable = true;
		var anGate = gates.create(250, 200, 'gate');
		anGate.body.immovable = true;

		glowyThings = game.add.group();
		glowyThings.enableBody = true;
		var glowy_1 = glowyThings.create(150, 300, 'glowy');
		var glowy_2 = glowyThings.create(200, 50, 'glowy');

		cursors = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeys( { 'upp': Phaser.Keyboard.W, 'downn': Phaser.Keyboard.S, 'leftt': Phaser.Keyboard.A, 'rightt': Phaser.Keyboard.D } );

		//music = new Phaser.Sound(game, 'pumpupthejams', 1, true);
		music = game.add.audio('pumpupthejams');
		music.loop = true;
		music.play();
	}

	function collectIt (player, star)
	{
		star.kill();
	}

	// And let's let things HAPPEN in this world~
	function update () {
		hitWall = game.physics.arcade.collide(playerFriend, walls);
		ghostHitWall = game.physics.arcade.collide(playerGhost, walls);
		hitGate = game.physics.arcade.collide(playerFriend, gates);

		glowyCollide = game.physics.arcade.overlap(playerFriend, glowyThings, collectIt, null, this);
		glowyGhostCollide = game.physics.arcade.overlap(playerGhost, glowyThings, collectIt, null, this);

		playerFriend.body.velocity.x = 0;
		playerFriend.body.velocity.y = 0;

		playerGhost.body.velocity.x = 0;
		playerGhost.body.velocity.y = 0;

		if (cursors.left.isDown)
		{
			// Move leftwards
			playerFriend.body.velocity.x = -200;
			//player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			// Move rightwards
			playerFriend.body.velocity.x = 200;
			//player.animations.play('right');
		}
		else if (cursors.up.isDown)
		{
			// Move upwards
			playerFriend.body.velocity.y = -200;
		}
		else if (cursors.down.isDown)
		{
			// Move downwards
			playerFriend.body.velocity.y = 200;
		}
		else
		{
			// just stop
		}

		if (game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			// Move upwards, ghost
		    playerGhost.body.velocity.y = -200;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			// Move downwards, ghost
			playerGhost.body.velocity.y = 200;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			// Move leftwards, ghost
			playerGhost.body.velocity.x = -200;
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			// MOve rightwards, ghost
			playerGhost.body.velocity.x = 200;
		}
		else
		{
			// just stop
		}
	}
};
