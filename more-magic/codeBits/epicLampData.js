"use strict";
// This ensures the JavaScript will be "strict", so you can't use undeclared variables etc.

// All loading functions will typically all be found inside "preload()".

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: setTheStage, update: step });
// This creates an object of Phaser Game, defines the screen size (w, h), and
// gives the designations of the all-important Preload, Create, and Update (Step) functions. We'll be looking at those next...

// but first let's make some vars

	var walls; // these are gonna be... you can't walk through these.

	var theLamp;
	var stateOfTheLamp;
	var cursors;
	var heroDirection;
	var isMoving;
	var flower;
	var youWon;
	var walls;

	var music0;
	var ourHero;
	var scoreText;
	var hitWall;

	function preload () // Okay, bring in the clowns!!!
	{
		// This is where we load in the assets, and they become usable by the game!
		game.load.image('lampOff', 'assets/visual/wall.png');
		game.load.image('lampOn', 'assets/visual/diamond.png');
		game.load.image('sky_bg', 'assets/visual/sky.png');
		game.load.image('flower', 'assets/visual/flower.png');
		game.load.image('wall', 'assets/visual/wall.png');
		game.load.spritesheet('aHumbleLamp', 'assets/visual/shiftDiamond.png', 32, 28);

		game.load.spritesheet('ourHero', 'assets/visual/heroStrip.png', 32, 32);
		game.load.audio('pumpupthejams', 'assets/audio/kickupthejam.mp3');
	}

	function setTheStage () // Get the clowns into position! ; And roll tape!
	{
		// And lo, the programmer said, let there BE a LAMP!
		stateOfTheLamp = 0;
		game.add.image(0, 0, 'sky_bg'); // and a background is good!
		theLamp = game.add.sprite(400, 300, 'aHumbleLamp', stateOfTheLamp); // these load the lamp with its default sprite
		cursors = game.input.keyboard.createCursorKeys();
		theLamp.fixedToCamera = true;

		game.physics.startSystem(Phaser.Physics.ARCADE); // we need physics i guess!
		scoreText = game.add.text(16, 16, 'Try to get the flower...', { fontSize: '32px', fill: '#000' });
		walls = game.add.group();
		walls.enableBody = true;
		var anWall = walls.create(0, game.world.height - 64, 'wall'); anWall.body.immovable = true;
		var anotherWall = walls.create(300, 100, 'wall'); anotherWall.body.immovable = true;
		var thirdWall = walls.create(332, 100, 'wall'); thirdWall.body.immovable = true;


		heroDirection = 0;
		isMoving = false;
		youWon = false;
		flower = game.add.sprite(70, 50, 'flower');
		ourHero = game.add.sprite(200, 150, 'ourHero', heroDirection);
		game.physics.arcade.enable(ourHero);
		game.physics.arcade.enable(flower);
		ourHero.enableBody = true;
		flower.enableBody = true;
		ourHero.body.collideWorldBounds = true;

		music0 = game.add.audio('pumpupthejams');
		music0.loop = true;
		music0.play();
		// And now, raise the curtain!!
	}

	function updateLamp ()
	{
		stateOfTheLamp  = 0;

		if (cursors.up.isDown)
		{
			stateOfTheLamp = 1;
		}

		theLamp.frame = stateOfTheLamp; // match the lamp's visuals to its current state
	}

	function updateHero ()
	{
		if (cursors.right.isDown)
		{
			isMoving = true;
			heroDirection = 1;
		}
		else if (cursors.up.isDown)
		{
			isMoving = true;
			heroDirection = 2;
		}
		else if (cursors.left.isDown)
		{
			isMoving = true;
			heroDirection = 3;
		}
		else if (cursors.down.isDown)
		{
			isMoving = true;
			heroDirection = 4;
		}
		else
		{
			isMoving = false;
		}

		if (isMoving)
		{
			if (heroDirection == 1)
			{
				ourHero.body.velocity.x = 200;
				ourHero.body.velocity.y = 0;
			}
			else if (heroDirection == 2)
			{
				ourHero.body.velocity.x = 0;
				ourHero.body.velocity.y = -200;
			}
			else if (heroDirection == 3)
			{
				ourHero.body.velocity.x = -200;
				ourHero.body.velocity.y = 0;
			}
			else if (heroDirection == 4)
			{
				ourHero.body.velocity.x = 0;
				ourHero.body.velocity.y = 200;
			}
			ourHero.frame = heroDirection;
		}
		else
		{
			ourHero.body.velocity.x = 0;
			ourHero.body.velocity.y = 0;
		}
	}

	function checkForCompletion()
	{
		game.physics.arcade.overlap(ourHero, flower, collectIt, null, this);
	}

	function collectIt (player, flower)
	{
  	 	// Removes the flower from the screen
  	 	flower.kill();

  	 	youWon = true;

   		// And congratulate the player on winning!
    	scoreText.text = 'You got the flower! Congrats~!';
	}


	function step () // Keep turning that crank, darn you! Give the crowds a little ACTION!!
	{
		// scoreText.text = 'You got the flower! Congrats~!';
		if (!youWon)
		{
			checkForCompletion();
			updateLamp();
		}
		hitWall = game.physics.arcade.collide(ourHero, walls);
		updateHero();
	}