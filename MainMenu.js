
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.background = this.add.sprite(0, 0, 'preloaderBackground').scale.setTo(2, 2);
		this.music = this.add.audio('titleMusic');
		this.music.play();

		this.add.sprite(225, 115, 'baseball').scale.setTo(1.3, 1.5);
		this.add.sprite(160, 180, 'board').scale.setTo(2.5, 1.5);

		this.add.text(26, 120, "Home Run", {
			font: "30px Arial",
			fill: "#ff0644",
			align: "left"
		});
		this.add.text(442, 120, "Derby Deluxe", {
			font: "28px Arial",
			fill: "#ff0644",
			align: "left"
		});

		//Set background color
		this.stage.backgroundColor = "#DB7648";

		//Play buttons
		this.add.sprite(20, 15, 'glove_black').scale.setTo(1.2, 1.2);
		this.playButton = this.add.button(20, 30, 'playButton', this.selectRed, this);//, 'buttonOver', 'buttonOut', 'buttonOver');
		this.add.sprite(15, 60, 'bat_wood').scale.setTo(2.5, 1.5);

		this.add.sprite(550, 15, 'glove_white').scale.setTo(1.2, 1.2);
		this.playButton = this.add.button(560, 30, 'playButton', this.selectWhite, this);//, 'buttonOver', 'buttonOut', 'buttonOver');
		this.add.sprite(555, 60, 'bat_metal').scale.setTo(2.3, 1.5);

		this.add.text(242, 12, "Last Score", {
			font: "26px Arial",
			fill: "#fff644",
			align: "left"
		});

		this.add.text(265, 195, "High Scores", {
			font: "20px Arial",
			fill: "#fff644",
			align: "left"
		});

		var scores = [];

		for (var i = 0; i < 10; i++) {
			var item = localStorage.getItem('item' + i);
			if (!item) {
				scores.push("0");
			}
			else {
				scores.push(item);
			}
		}

		if (scores[0] == "" + this.game.score && this.game.score != 0) {
			var score = this.add.text(242, 45, "" + this.game.score, {
				font: "26px Arial",
				fill: "#ff0644",
				align: "left"
			});
		}
		else {
			var score = this.add.text(242, 45, "" + this.game.score, {
				font: "26px Arial",
				fill: "#fff644",
				align: "left"
			});
		}

		for (var i = 0; i < 5; i++) {
			if (scores[0] == "" + this.game.score && i == 0 && this.game.score != 0) {
				this.add.text(210, 220 + (i * 22), (i + 1) + " - " + scores[i], {
					font: "18px Arial",
					fill: "#ff0644",
					align: "left"
				});
				var emitter = this.add.emitter(this.world.centerX, 100, 40);
				emitter.makeParticles('bonus');
				//	false means don't explode all the sprites at once, but instead release at a rate of 20 particles per frame
				//	The 5000 value is the lifespan of each particle
				emitter.start(true, 3500, 20, 40);
			}
			else {
				this.add.text(210, 220 + (i * 22), (i + 1) + " - " + scores[i], {
					font: "18px Arial",
					fill: "#fff644",
					align: "left"
				});
			}
		}
		for (var i = 0; i < 5; i++) {
			this.add.text(340, 220 + (i * 22), (i + 6) + " - " + scores[i + 5], {
				font: "18px Arial",
				fill: "#fff644",
				align: "left"
			});
		}

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	selectWhite: function () {
		this.game.playerWear = 'characterWhite';
		this.game.pitcherWear = 'characterRed';
		this.game.playerBat = 'bat_metal';
		this.game.batHit = 'hit_metal';
		this.startGame();
	},

	selectRed: function () {
		this.game.playerWear = 'characterRed';
		this.game.pitcherWear = 'characterWhite';
		this.game.playerBat = 'bat_wood';
		this.game.batHit = 'hit_wood';
		this.startGame();
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
