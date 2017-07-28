
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground').scale.setTo(2, 2);
		this.preloadBar = this.add.sprite(260, 120, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		//this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		this.load.image('playButton', 'images/play.png');
		this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		this.load.audio('hit_wood', ['audio/wood_hit.mp3']);
		this.load.audio('hit_metal', ['audio/metal_hit.mp3']);	
		this.load.audio('claps', ['audio/claps.mp3']);
		this.load.audio('crowd', ['audio/crowd.mp3']);												
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//Character
		this.load.image('characterRed', 'images/character/Red.png');
		this.load.image('characterWhite', 'images/character/White.png');
		//Ground
		this.load.spritesheet('ground', 'images/groundGravel.png', 64, 64);
		//Ball
		this.load.image('ball', 'images/ball.png');
		//Bat
		this.load.image('bat_wood', 'images/bat/bat_handle.png');
		this.load.image('bat_metal', 'images/bat/bat_metal.png');

		//Gloves
		this.load.image('glove_black', 'images/glove_black.png');
		this.load.image('glove_white', 'images/glove_white.png');

		//Targets
		this.load.image('red_circle', 'images/red_circle.png');
		this.load.image('blue_circle', 'images/blue_circle.png');
		this.load.image('green_circle', 'images/green_circle.png');
		this.load.image('yellow_circle', 'images/yellow_circle.png');

		//Grass
		this.load.image('grass', 'images/grass.png');

		//Board
		this.load.image('board', 'images/board.png');

		//Menu
		this.load.image('baseball', 'images/baseball.png');	
		
		this.load.image('bonus', 'images/levelup.png');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;
		this.stage.backgroundColor = "#DB7648";

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
