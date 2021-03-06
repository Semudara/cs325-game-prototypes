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

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

	function preload() {

	    game.load.image('sky', 'assets/sky.png');
	    game.load.image('ground', 'assets/platform.png');
	    game.load.image('star', 'assets/star.png');
	    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	    game.load.image('diamond', 'assets/diamond.png');
	    game.load.image('theend', 'assets/theend.png'); // loads the sprite, gives it a nicer name

	    game.load.audio('kickupthejam', 'assets/kickupthejam.mp3'); // couldn't figure out how to get this to work =(

	}

	var player;
	var platforms;
	var cursors;

	var stars;
	var diamonds;

	var listen;

	var score = 0;
	var scoreText;

	// Okay, let's get started!!!

	function create() {

	    //  We're going to be using physics, so we enable the Arcade Physics system

	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    //  A simple background for our game =)

	    game.add.sprite(0, 0, 'sky');

	    //  The platforms group contains the ground and the 2 ledges we can jump on!

	    platforms = game.add.group();

	    //  We will enable physics for any object that is created in this group

	    platforms.enableBody = true;

	    // Here we create the ground. Let there be dirt!

	    var ground = platforms.create(0, game.world.height - 64, 'ground');

	    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)

	    ground.scale.setTo(2, 2);

	    //  This stops the ground from falling away when you jump on it

	    ground.body.immovable = true;

	    //  Now let's create two ledges

	    var ledge = platforms.create(400, 400, 'ground');
	    ledge.body.immovable = true;

	    ledge = platforms.create(-150, 250, 'ground');
	    ledge.body.immovable = true;

	    // The player and its settings

	    player = game.add.sprite(32, game.world.height - 150, 'dude');

	    //  We need to enable physics on the player, naturally

	    game.physics.arcade.enable(player);

	    //  Player physics properties. Give the little guy a slight bounce!

	    player.body.bounce.y = 0.2;
	    player.body.gravity.y = 300;
	    player.body.collideWorldBounds = true;

	    //  Our two animations, walking left and right.

	    player.animations.add('left', [0, 1, 2, 3], 10, true);
	    player.animations.add('right', [5, 6, 7, 8], 10, true);

	    // We should have a score, yeah?

	    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

	    // Um , music

	    listen = game.add.audio('kickupthejam');

	    //  Finally, some stars to collect!! *sparkle sparkle* :D

	    stars = game.add.group();

	    //  We will enable physics for any star that is created in this group

	    stars.enableBody = true;

	    //  Here, we'll create 12 of them evenly spaced apart:

	    for (var i = 0; i < 12; i++)
	    {
	        //  Create a star inside of the 'stars' group
	        var star = stars.create(i * 70, 0, 'star');

	        //  Let gravity do its thing~
	        star.body.gravity.y = 300;

	        //  This just gives each star a slightly random bounce value ;p
	        star.body.bounce.y = 0.7 + Math.random() * 0.2;
	    }

	    // Maybe I~ll add an evil Diamond because I can

	    diamonds = game.add.group();
	    diamonds.enableBody = true;
	    var thisDiamond = diamonds.create(600, 368, 'diamond');

	    //  Our controls. All-important!

	    cursors = game.input.keyboard.createCursorKeys();

	}

	function update() {

	    //  Collide the player and the stars with the platforms

	    var hitPlatform = game.physics.arcade.collide(player, platforms);
	    game.physics.arcade.collide(stars, platforms);

	    //  Checks to see if the player overlaps with any of the stars; if they do, call the collectStar function!

	    game.physics.arcade.overlap(player, stars, collectStar, null, this);

	    //  Checks to see if the player overlaps with the Diamond

	    game.physics.arcade.overlap(player, diamonds, hitTheDiamond, null, this);

	    //  Reset the player~s velocity (movement)

	    player.body.velocity.x = 0;

		//  Our little guy should be able to move about based on inputs, right?

	    if (cursors.left.isDown)
	    {
	        //  Move to the left
	        player.body.velocity.x = -150;

	        player.animations.play('left');
	    }
	    else if (cursors.right.isDown)
	    {
	        //  Move to the right
	        player.body.velocity.x = 150;

	        player.animations.play('right');
	    }
	    else
	    {
	        //  Stand still
	        player.animations.stop();

	        player.frame = 4;
	    }

	    //  Allow the player to jump if they are touching the ground. (by pressing 'up')

	    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
	    {
	        player.body.velocity.y = -350;
	    }

	}

	// getting those stars, yo

	function collectStar (player, star) {

	    // Removes the star from the screen
	    star.kill();

	    // Add to and update the score!
	    score += 100;
	    if (score < 1200)
	    {
	    	scoreText.text = 'Score: ' + score;
	    }
	    else
	    {
	    	scoreText.text = 'YOU DID IT!!!';
	    }

	}

	// you touch the diamond, you mcFreakin die

	function hitTheDiamond (player, thisDiamond) {

		// Goodbye, player
		score -= 900;
		scoreText.text = 'You died, oh no... Final Score: ' + score;
		thisDiamond.kill();
		//player.kill();
		//var theEnd = diamonds.create(600, 368, 'theend');
		//player.kill();
		//listen.loopFull();
	}

	// end of code
};
