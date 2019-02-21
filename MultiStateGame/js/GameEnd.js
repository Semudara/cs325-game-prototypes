"use strict";

BasicGame.GameEnd = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.GameEnd.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();

		//this.add.sprite(0, 0, 'titlePage');

		this.playButton = this.add.button( 303, 400, 'playButton', this.restartGame, this, 'over', 'out', 'down');

	},

	update: function () {

		// do something cool!

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game1');

	},

    restartGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		this.music.stop();

		this.music = null;
		this.playButton = null;
        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
