"use strict";

BasicGame.Game1 = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */

    // For optional clarity, you can initialize
    // member variables here!!! Otherwise, you will do it in create().
    this.bouncy = null;
    this.walls = null; // these are gonna be... you can't walk through these.
	this.player = null; // hello, there!
	this.glowyThings = null; // you want these
	this.gates = null;

	this.hitWall = null; // collisons lol
	this.hitGate = null;
	this.cursors = null; // user input
	this.music = null;

	this.glowyCollide = null; // tfw you touch a glowyThing

	this.score = 0;
	this.scoreText = null;
};

BasicGame.Game1.prototype = {

    create: function () {

/*
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

        // Create a sprite at the center of the screen using the 'logo' image.
        this.bouncy = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        this.bouncy.anchor.setTo( 0.5, 0.5 );

        // Turn on the arcade physics engine for this sprite.
        this.game.physics.enable( this.bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        this.bouncy.body.collideWorldBounds = true;

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = this.game.add.text( this.game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );

        // When you click on the sprite, you go back to the MainMenu.
        this.bouncy.inputEnabled = true;
        this.bouncy.events.onInputDown.add( function() { this.quitGame(); }, this ); */

 		this.add.sprite(24, 22, 'glowy');

 		this.physics.startSystem(Phaser.Physics.ARCADE);
 		this.add.image(0, 0, 'sky_bg');

 		this.player = this.game.add.sprite(32, this.game.world.height - 150, 'friend');
 		this.game.physics.arcade.enable(this.player);
 		this.player.enableBody = true;
 		//player.body.bounce.y = 0.2;
 		//player.body.gravity.y = 300;
 		this.player.body.collideWorldBounds = true;

 		//playerGhost = game.add.sprite(200, 300, 'ghost');
 		//game.physics.arcade.enable(playerGhost);
 		//playerGhost.enableBody = true;
 		//playerGhost.body.collideWorldBounds = true;

 		//player.animations.add('left', [0, 1, 2, 3], 10, true); // 10 fps, loop = true;
 		//player.animations.add('right', [5, 6, 7, 8], 10, true);

 		// ello am i error

 		this.walls = this.game.add.group();
 		this.gates = this.game.add.group();
 		this.walls.enableBody = true; // enables physics
 		this.gates.enableBody = true;
 		//ground = walls.create(0, game.world.height - 64, 'ground');
 		//ground.scale.setTo(2, 2); // scale it properly (it too small)
 		//walls.body.immovable = true; // so you won't take the ground with you =P
 		this.anWall = this.walls.create(0, this.game.world.height - 64, 'wall');
 		this.anWall.body.immovable = true;
 		this.anotherWall = this.walls.create(300, 100, 'wall');
 		this.anotherWall.body.immovable = true;
 		this.anGate = this.gates.create(250, 200, 'gate');
 		this.anGate.body.immovable = true;

 		this.glowyThings = this.game.add.group();
 		this.glowyThings.enableBody = true;
 		this.glowy_1 = this.glowyThings.create(150, 300, 'glowy');
 		this.glowy_2 = this.glowyThings.create(200, 50, 'glowy');

 		this.cursors = this.game.input.keyboard.createCursorKeys();
 		this.game.input.keyboard.addKeys( { 'upp': Phaser.Keyboard.W, 'downn': Phaser.Keyboard.S, 'leftt': Phaser.Keyboard.A, 'rightt': Phaser.Keyboard.D } );

 		this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
 		//music = new Phaser.Sound(game, 'pumpupthejams', 1, true);
 		this.music = this.game.add.audio('pumpupthejams');
 		this.music.loop = true;
		this.music.play();
    },

	collectIt: function (player, star)
	{
		star.kill();
		this.score += 1;
		if (this.score < 2)
		{
			this.scoreText.text = 'Score: ' + this.score;
			//this.endGame();
		}
		else
		{
			this.endGame();
		}
	},

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.bouncy.rotation = this.game.physics.arcade.accelerateToPointer( this.bouncy, this.game.input.activePointer, 500, 500, 500 );

        if (this.player != null)
        {

			this.hitWall = this.game.physics.arcade.collide(this.player, this.walls);
		//ghostHitWall = game.physics.arcade.collide(playerGhost, walls);
			this.hitGate = this.game.physics.arcade.collide(this.player, this.gates);

			this.glowyCollide = this.game.physics.arcade.overlap(this.player, this.glowyThings, this.collectIt, null, this);
		//glowyGhostCollide = game.physics.arcade.overlap(playerGhost, glowyThings, collectIt, null, this);

			if (this.player != null)
			{
				this.player.body.velocity.x = 0;
				this.player.body.velocity.y = 0;
			}

		//playerGhost.body.velocity.x = 0;
		//playerGhost.body.velocity.y = 0;

/*
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
		*/
			if (this.player != null)
			{

				if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.cursors.up.isDown)
				{
			// Move upwards, ghost
		  	 		 this.player.body.velocity.y = -200;
				}
				else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S) || this.cursors.down.isDown)
				{
			// Move downwards, ghost
					this.player.body.velocity.y = 200;
				}
				else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.cursors.left.isDown)
				{
			// Move leftwards, ghost
					this.player.body.velocity.x = -200;
				}
				else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.cursors.right.isDown)
				{
			// MOve rightwards, ghost
					this.player.body.velocity.x = 200;
				}
				else
				{
					// just stop
				}
			}
		}
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    },

    endGame: function () {
		this.music.stop();
    	this.bouncy = null;
  	    this.anWall = null;
  	    this.anotherWall = null;
 	    this.walls = null; // these are gonna be... you can't walk through these.
		this.player = null; // hello, there!
		this.glowy_1 = null;
		this.glowy_2 = null;
		this.glowyThings = null; // you want these
		this.anGate = null;
		this.gates = null;

		this.hitWall = null; // collisons lol
		this.hitGate = null;
		this.cursors = null; // user input
		this.music = null;
		this.score = null;
		this.scoreText = null;
		this.glowyCollide = null;

		this.cursors = null;

		this.state.start('GameEnd'); // you beat the game!
	}

};
