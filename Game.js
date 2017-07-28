var batSound;
var clapsSound;
var crowdSound;
var strikes;
var outs;
var score;
var hruns;
var time;
var GAME_TIME = 60;
var message;
var bonus;

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

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
    this.ball;
    this.player;
    this.pitcher;
    this.bat;
    this.strikes = 0;
    this.outs = 0;
    this.score = 0;
    this.hruns = 0;
    this.tiempo;
    this.playerLocation;

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.createPlayer = function createPlayer() {
        // The player and its settings
        var player = this.add.sprite(this.playerLocation[0], this.playerLocation[1], this.game.playerWear);
        player.centerX = this.playerLocation[0];
        player.centerY = this.playerLocation[1];
        this.physics.p2.enable(player);
        player.body.static = true;
        return player;
    }

    this.createBat = function createBat() {
        var bat = this.add.sprite(this.playerLocation[0], this.playerLocation[1], this.game.playerBat);
        bat.centerX = this.playerLocation[0] + 22;
        bat.centerY = this.playerLocation[1] - 5;
        //  We need to enable physics on the ball
        this.physics.p2.enable(bat);
        bat.body.dynamic = true;
        bat.collideWorldBounds = false;
        bat.body.mass = 1;
        //bat.enableBody = true;
        //bat.anchor.setTo(0, 0.5);
        //bat.pivot.x = 0;
        //bat.pivot.y = bat.height * .5;
        //bat.body.immovable = true;
        return bat;
    }

    this.createBall = function createBall() {
        this.ball = this.add.sprite(this.pitcher.x, this.pitcher.y + 5, 'ball');
        //  We need to enable physics on the ball
        this.physics.p2.enable(this.ball);
        this.ball.dynamic = true;
        this.ball.mass = 0.5;
        //this.ball.enableBody = true;
        this.ball.body.onBeginContact.add(this.contactHandler);

        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors (as an x,y point). "1" is 100% energy return
        //this.ball.body.bounce.setTo(1, 1);
    }

    this.createPitcher = function createPitcher() {
        // The pitcher and its settings
        var pitcher = this.add.sprite(330, 215, this.game.pitcherWear);
        pitcher.angle = 90;
        return pitcher;
    }

    this.createTargets = function createTargets() {
        this.add.sprite(20, -30, 'red_circle').scale.setTo(3.3, 3.3);
        this.add.sprite(140, -100, 'blue_circle').scale.setTo(5, 5);
        this.add.sprite(325, -100, 'green_circle').scale.setTo(5, 5);
        this.add.sprite(505, -30, 'yellow_circle').scale.setTo(3.3, 3.3);
    }

    this.createGround = function createGround() {
        //  The ground group contains the ground
        var ground = this.add.group();
        // Here we create the ground.
        var frames = [137, 102, 111,/*outfield*/102, 86, 73, 102,/*infield*/ 162, 206, 85,/*outfield*/0, 0, 72, 59,/*infield*/ 135, 92, 109, /*outfield*/0, 0, 0, 0, 162, 0, 0, 0, 0, 0, 0, 146, 0, 0, 0, 0, 0, 0, 145, 132, 0, 0, 0, 0, 0, 162, 131, 0, 0, 0, 162];
        var angles = [45, 45, 45,/*outfield*/45, 45, 45, 45,/*infield*/ 45, 45, 45,/*outfield*/45, 45, 45, 45,/*infield*/ 45, 45, 45,/*outfield*/ 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45];
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                ground.create(-i * 45 + 320 + j * 45, -i * 45 + 276 - j * 45, 'ground', frames[i * 7 + j]).angle = angles[i * 7 + j];
            }
        }
        var grassRight = this.add.image(390, this.world.height - 80, 'grass');
        grassRight.angle = -45;
        grassRight.scale.setTo(1.4, 2)
        //grassRight.scale.setTo(2.8, 4)
        var grassLeft = this.add.image(0, this.world.height - 330, 'grass');
        grassLeft.angle = 45;
        grassLeft.scale.setTo(1.4, 2);
        //grassLeft.scale.setTo(2.8, 4);

        return ground;
    }

    this.prepareSwing = function () {
        //this.bat.body.rotateRight(5);
        this.bat.body.angularVelocity = 30;//this.game.add.tween(this.player.children[i]).to({ angle : '45' }, 500, Phaser.Easing.Linear.None, true);
    }

    this.swing = function () {
        this.tiempo = this.time.now;
        this.bat.body.angularVelocity = this.rnd.integerInRange(-120, -100);//this.game.add.tween(this.player.children[i]).to({ angle: '-90' }, 100, Phaser.Easing.Linear.None, true);
    }

    this.pitch = function () {
        this.ball.body.x = this.pitcher.x;
        this.ball.body.y = this.pitcher.y + 5;
        this.ball.body.velocity.x = this.rnd.integerInRange(-10, 5);
        this.ball.body.velocity.y = this.rnd.integerInRange(95, 180);
    }

    this.contactHandler = function contactHandler(body, shape1, shape2, equation) {
        batSound.play();
    }
};

BasicGame.Game.prototype = {

    create: function () {

        this.strikes = 0;
        this.outs = 0;
        this.score = 0;
        this.hruns = 0;

        this.playerLocation = [300, 355];

        //Add sound
        batSound = this.add.audio(this.game.batHit);
        crowdSound = this.add.audio('crowd');
        clapsSound = this.add.audio('claps');
        clapsSound.volume = 0.7;

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.P2JS);

        //  Our world size is 1600 x 1200 pixels
        this.world.setBounds(-50, -50, 700, 450);

        //  Make things a bit more bouncey
        this.physics.p2.restitution = 2.5;

        //Set background color
        this.stage.backgroundColor = "#DB7648";

        //Ground
        this.createGround();

        this.createTargets();

        //Create pitcher
        this.pitcher = this.createPitcher();

        //Create bat
        this.bat = this.createBat();

        //Create player
        this.player = this.createPlayer();

        this.game.physics.p2.createRevoluteConstraint(this.player.body, [8, 5], this.bat.body, [-25, 0], 6000);

        //Create ball
        this.createBall();

        this.pitch();

        //Board
        var board = this.add.image(8, 180, 'board').scale.setTo(1.1, 1.65);
        strikes = this.add.text(25, 200, "Strikes: 0", {
            font: "14px Arial",
            fill: "#fff044",
            align: "left"
        });
        outs = this.add.text(25, 230, "Outs: 0", {
            font: "14px Arial",
            fill: "#fff044",
            align: "left"
        });
        hruns = this.add.text(25, 260, "Home Runs: 0", {
            font: "14px Arial",
            fill: "#fff044",
            align: "left"
        });
        score = this.add.text(25, 290, "Score: 0", {
            font: "14px Arial",
            fill: "#fff044",
            align: "left"
        });
        this.tiempo = GAME_TIME;
        time = this.add.text(25, 320, "Time: " + GAME_TIME + "s", {
            font: "14px Arial",
            fill: "#fff044",
            align: "left"
        });
        message = this.add.text(210, 50, "", {
            font: "40px Arial",
            fill: "#fff044",
            align: "center"
        });
        bonus = this.add.text(380, 250, "", {
            font: "26px Arial",
            fill: "#fff044",
            align: "center"
        });

        this.bonus = this.add.sprite(500, 200, 'bonus');
        this.bonus.scale.setTo(2, 2);
        this.bonus.alpha = 0

        //Add input
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.prepareSwing, this);
        this.spaceKey.onUp.add(this.swing, this);
        //Touch input
        this.input.onDown.add(this.prepareSwing, this);
        this.input.onUp.add(this.swing, this);
        this.time.reset();
        crowdSound.play();
    },

    update: function () {
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        //  Collide the player and the stars with the platforms
        //  Reset the players velocity (movement)
        var t = Math.round(this.time.totalElapsedSeconds());
        this.tiempo = GAME_TIME - t;
        time.setText("Time: " + this.tiempo + "s");

        if (this.ball.top > 360 || this.ball.right > 640 || this.ball.left < 0 || this.ball.bottom < 0) {
            var speed = Math.sqrt(Math.pow(this.ball.body.velocity.x, 2) + Math.pow(this.ball.body.velocity.y, 2));
            speed = Math.round(speed);
            if (this.ball.top > 360 || (this.ball.right > 640 && this.ball.centerY > 55) || (this.ball.left < 0 && this.ball.centerY > 55)) {
                console.log("STRIKE!!!");
                this.strikes += 1;
            }
            else if (speed < 300) {
                console.log("OUT");
                this.outs += 1;
                this.strikes = 0;
                message.setText(this.outs+" OUTS");
                message.alpha = 1
                this.add.tween(message).to( { alpha: 0 }, 1000, "Linear", true);
            }
            else {
                this.hruns += 1;
                if (this.ball.right < 100) {
                    console.log("HOME RUN!! + 1000")
                    this.score += 1000;
                    clapsSound.play();
                }
                else if (this.ball.right < 370) {
                    console.log("HOME RUN!! + 800")
                    this.score += 800;
                    crowdSound.play();
                }
                else if (this.ball.right < 500) {
                    console.log("HOME RUN!! + 200")
                    this.score += 200;
                }
                else {
                    console.log("HOME RUN!! + 500")
                    this.score += 500;
                }
                if (speed > 1000) {
                    this.score += speed * 2;
                    this.bonus.alpha = 1
                    this.add.tween(this.bonus).to( { alpha: 0 }, 1000, "Linear", true);
                    bonus.setText("+"+(speed*2)+"\nDOUBLE SPEED BONUS");
                    bonus.alpha = 1
                    this.add.tween(bonus).to( { alpha: 0 }, 1000, "Linear", true);
                    clapsSound.play();                    
                }
                else if (speed > 500) {
                    this.score += speed;
                    this.bonus.alpha = 1                    
                    this.add.tween(this.bonus).to( { alpha: 0 }, 1000, "Linear", true);                    
                    bonus.setText("+"+speed+"\nSPEED BONUS");
                    bonus.alpha = 1
                    this.add.tween(bonus).to( { alpha: 0 }, 1000, "Linear", true);
                    crowdSound.play();                    
                }
                score.setText("Score: " + this.score);
                hruns.setText("Home Runs: " + this.hruns);
                message.setText("HOME RUN!");
                message.alpha = 1
                this.add.tween(message).to( { alpha: 0 }, 1000, "Linear", true);             
            }
            this.pitch();
        }

        if (this.strikes == 3) {
            this.outs += 1;
            this.strikes = 0;
            message.setText(this.outs+" OUTS");
            message.alpha = 1
            this.add.tween(message).to( { alpha: 0 }, 1000, "Linear", true);   
            clapsSound.play();
        }
        strikes.setText("Strikes: " + this.strikes);
        outs.setText("Outs: " + this.outs);

        if (this.tiempo == 0 || this.outs == 3) {
            this.game.score = this.score;
            this.recursiveSetScore(0, this.score);
            this.quitGame();
        }
    },

    recursiveSetScore : function (i, scoreLocal){
        console.log("obteniendo : "+i+" - "+scoreLocal);
        if(i > 9){
            return;
        }
        var item = localStorage.getItem('item'+i);
        if(!item || item == "0"){
            localStorage.setItem('item'+i, ""+scoreLocal);
        }
        else if(parseInt(item) < parseInt(scoreLocal)){
            localStorage.setItem('item'+i, ""+scoreLocal);
            this.recursiveSetScore(i+1, item);
        }
        else if(parseInt(item) > parseInt(scoreLocal)){
            this.recursiveSetScore(i+1, ""+scoreLocal);
        }
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        //  Then let's go back to the main menu.
        this.state.start('MainMenu');
    }

};
