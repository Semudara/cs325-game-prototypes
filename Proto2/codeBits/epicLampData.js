"use strict";
// This ensures the JavaScript will be "strict", so you can't use undeclared variables etc.

// All loading functions will typically all be found inside "preload()".

var game = new Phaser.Game(608, 608, Phaser.AUTO, '', { preload: preload, create: setTheStage, update: step });
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
	var youHaveLost;
	var hearts;
	var hurtyGhosts;
	var potions;

	var music0;
	var ourHero;
	var scoreText;
	var hitWall;
	var collideGhost;
	var hitPotion;

	var hitPoints; // we're gonna have health now!

	var width;
	var height;

	var fourthHeart;
	var thirdHeart;
	var secondHeart;
	var firstHeart;

	var layer1;
	var hitTiles;

	function preload () // Okay, bring in the clowns!!!
	{
		// This is where we load in the assets, and they become usable by the game!
		game.load.image('lampOff', 'assets/visual/wall.png');
		game.load.image('lampOn', 'assets/visual/diamond.png');
		game.load.image('sky_bg', 'assets/visual/sky.png');
		game.load.image('flower', 'assets/visual/flower.png');
		game.load.image('wall', 'assets/visual/wall.png');
		game.load.image('hurtyThing', 'assets/visual/meanGhost.png');
		game.load.image('potion', 'assets/visual/firstaid.png');
		game.load.spritesheet('aHumbleLamp', 'assets/visual/shiftDiamond.png', 32, 28);

		game.load.spritesheet('ourHero', 'assets/visual/heroStrip.png', 32, 32);
		game.load.spritesheet('heart_img', 'assets/visual/heart.png', 32, 32); // I'm getting better at this!
		game.load.audio('pumpupthejams', 'assets/audio/kickupthejam.mp3');

		// Can I??? Really do a tileMap?

		game.load.tilemap('aCuriousPlace', 'assets/tileMaps/testMap.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('ohHeavens', 'assets/visual/ohHeavens.png'); // you have to load the tileset separately!
	}

	function setTheStage () // Get the clowns into position! ; And roll tape!
	{
		width = game.world.width;
		height = game.world.height;

		// And lo, the programmer said, let there BE a LAMP!
		stateOfTheLamp = 0;
		game.add.image(0, 0, 'sky_bg'); // and a background is good!
		var map = game.add.tilemap('aCuriousPlace'); map.addTilesetImage('ohHeavens');
		layer1 = map.createLayer('Tile Layer 1');
		// Holy heck it works!!! Remember to Embed Tileset before exporting your tileMap, though~
		theLamp = game.add.sprite(width - 32, height - 32, 'aHumbleLamp', stateOfTheLamp); // these load the lamp with its default sprite
		cursors = game.input.keyboard.createCursorKeys();
		theLamp.fixedToCamera = true;

		game.physics.startSystem(Phaser.Physics.ARCADE); // we need physics i guess!
		scoreText = game.add.text(16, 16, 'Try to get the flower...', { fontSize: '32px', fill: '#000' });
		scoreText.fixedToCamera = true;
		walls = game.add.group();
		//hearts = game.add.group();
		walls.enableBody = true;
		var anWall = walls.create(0, height - 64, 'wall'); anWall.body.immovable = true;
		var anotherWall = walls.create(300, 100, 'wall'); anotherWall.body.immovable = true;
		var thirdWall = walls.create(332, 100, 'wall'); thirdWall.body.immovable = true;




		heroDirection = 0;
		isMoving = false;
		youWon = false;
		youHaveLost = false;
		hitPoints = 4;
		flower = game.add.sprite(70, 50, 'flower');
		ourHero = game.add.sprite(270, 550 + 160, 'ourHero', heroDirection);
		game.physics.arcade.enable(ourHero);
		game.physics.arcade.enable(flower);
		ourHero.enableBody = true;
		flower.enableBody = true;
		ourHero.body.collideWorldBounds = true;

		game.world.setBounds(0, 0, 608, 800); // 200, 150, 400, 300
		game.camera.follow(ourHero);
		game.camera.deadzone = new Phaser.Rectangle(200, 150, 400, 300);

		hearts = game.add.group();

		fourthHeart = hearts.create(width - 64, 32, 'heart_img', 0);
		thirdHeart = hearts.create(width - 96, 32, 'heart_img', 0);
		secondHeart = hearts.create(width - 128, 32, 'heart_img', 0);
		firstHeart = hearts.create(width - 160, 32, 'heart_img', 0);

		firstHeart.fixedToCamera = true;
		secondHeart.fixedToCamera = true;
		thirdHeart.fixedToCamera = true;
		fourthHeart.fixedToCamera = true;

		// what if we did animations?
		//
		// ourHero.animations.add('walkLeft', [0, 1, 2, 3]);
		// ourHero.animations.add('walkRight', [4, 5, 6, 7]);
		// if (player is walking leftwards){
		// ourHero.animations.play('walkLeft', 5, true); // I assume the boolean is whether it loops!! And the number is FPS.
		// when the player stops walking left...
		// ourHero.animations.stop('walkLeft'); ourHero.frame = 0;

		map.setCollision(4, true, 'Tile Layer 1'); // now the purple tiles should be solid... well, once I......

		hurtyGhosts = game.add.group();
		game.physics.arcade.enable(hurtyGhosts);
		hurtyGhosts.enableBody = true;

		var inky = hurtyGhosts.create(96, 480, 'hurtyThing');
		var blinky = hurtyGhosts.create(160, 480, 'hurtyThing');
		var clyde = hurtyGhosts.create(64, 370, 'hurtyThing');
		var pinky = hurtyGhosts.create(196, 480, 'hurtyThing');

		potions = game.add.group();
		game.physics.arcade.enable(potions);
		potions.enableBody = true;

		var onePotion = potions.create(width - 64, height - 196, 'potion'); // come back to this
		onePotion.body.immovable = true;

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

	function setFrame (theSprite, desiredFrame) // that second one's an int
	{
		theSprite.frame = desiredFrame;
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

	function collectThat(player, somePotion)
	{
		// Removes the potion from the screen
		somePotion.kill();

		if (hitPoints < 4)
		{
			hitPoints++; // but you recover health!
		}
	}

	function mad (player, theBadThing)
	{
		theBadThing.kill();
		hitPoints--;
	}

	function youLose ()
	{
		// Removes theLamp and ourHero from the game...
		theLamp.kill();
		scoreText.text = "It's all over...";
		ourHero.kill();
		youHaveLost = true;
	}

	function visualizeHealth ()
	{
		if (hitPoints > 3) // if they have full health
		{
			setFrame(firstHeart, 0);
			setFrame(secondHeart, 0);
			setFrame(thirdHeart, 0);
			setFrame(fourthHeart, 0);
		}
		else if (hitPoints > 2) // if they've lost only one heart...
		{
			setFrame(firstHeart, 0);
			setFrame(secondHeart, 0);
			setFrame(thirdHeart, 0);
			setFrame(fourthHeart, 1);
		}
		else if (hitPoints > 1) // if they've lost two hearts...
		{
			setFrame(firstHeart, 0);
			setFrame(secondHeart, 0);
			setFrame(thirdHeart, 1);
			setFrame(fourthHeart, 1);
		}
		else if (hitPoints > 0) // if they're down to the last heart...
		{
			setFrame(firstHeart, 0);
			setFrame(secondHeart, 1);
			setFrame(thirdHeart, 1);
			setFrame(fourthHeart, 1);
		}
		else // oh no
		{
			setFrame(firstHeart, 1);
			setFrame(secondHeart, 1);
			setFrame(thirdHeart, 1);
			setFrame(fourthHeart, 1);
		}
	}

	function checkForDeath ()
	{
		if (hitPoints < 1)
		{
			youLose();
		}
	}


	function step () // Keep turning that crank, darn you! Give the crowds a little ACTION!!
	{
		// scoreText.text = 'You got the flower! Congrats~!';
		if (!youWon && !youHaveLost)
		{
			checkForCompletion();
			updateLamp();
			game.physics.arcade.overlap(ourHero, hurtyGhosts, mad, null, this);
			visualizeHealth();
			game.physics.arcade.overlap(ourHero, potions, collectThat, null, this);
		}

		hitWall = game.physics.arcade.collide(ourHero, walls);
		collideGhost = game.physics.arcade.collide(ourHero, hurtyGhosts);
		hitTiles = game.physics.arcade.collide(ourHero, layer1); ///.... do this!!

		if (!youHaveLost)
		{
			updateHero();
			checkForDeath();
		}
	}