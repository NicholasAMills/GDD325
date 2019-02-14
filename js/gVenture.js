//This will be our config seetup for Phaser...mostly self explanatory, we specify our games width, height, the viewing type (Options include Phaser.AUTO, CANVAS, WebGl Rendering modes
//and then our (currently) defined scenes.
var config = {
    type: Phaser.AUTO,
    parent: 'body',
    width: 1920,
    height: 1080,
	physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: { //Appears Phaser knows to automatically go to preload?
        preload: preload,
        create: create,
		update:update
    }
};
//Pass our config to the Phaser game object
var game = new Phaser.Game(config);
var cursors;
var graphics;
var player;
//Preloading image, sound, and any other assets that need to get loaded here
function preload () {
	this.isZoomed = false;
    //this.load.image('logo', 'assets/pics/logo.png');
	this.load.image('BG', 'assets/pics/bg.png');
	this.load.image('player', 'assets/pics/cursor.png');
	this.load.image('leaves', 'assets/pics/logo.png');
	/* End Image loading */
	/*Spritesheets Below*/
	this.load.spritesheet('frg','assets/pics/frg.png',
		{ frameWidth: 74, frameHeight: 59 } //Gets the width and height ofe very frame to play
    );
	
	/*End Spritesheets*/
	this.load.audio('birds', 'assets/FX/default.wav');
	this.load.audio('gulp', 'assets/FX/gulp.wav');
	this.load.audio('smAnim', 'assets/FX/smAnimal.wav');
	this.load.audio('squeak', 'assets/FX/SQUEAK.wav');
	this.load.audio('wood' ,'assets/FX/wood.wav');
	this.load.audio('item', 'assets/FX/pickup.wav');
	this.load.audio('selectable', 'assets/FX/ObjectFound.wav');
	/*End audio load*/
}
//Actual creation/placement of our preloaded assets
function create () {
	window.addEventListener('resize', resize);//window.requestPointerLock();
    resize();
	gameCamera = this.cameras.main; //Get our camera object
	//gameCamera.startFollow(game.input.mousePointer,false, 0.1, 0.1);
	//gameCamera.setZoom(0.65);
	this.cursors = this.input.keyboard.createCursorKeys();
	
	gameCamera.setViewport(0,0, 1920,1080);
	this.cameras.main.setBounds(0,0, 4800, 2700, true); 
	this.physics.world.setBounds(0,0, 4800, 2700, true, true, true, true); //Set bounds, first parameter will be top left x bound coordinate, second paramter the top left y bound, followed by width, then height
	//this.input.setDefaultplayer('url(assets/pics/player.png), pointer');
	this.player = this.physics.add.sprite(50, 150, 'player').setDepth(1000);
	this.player.setCollideWorldBounds();
	//Camera's inputs are its x position (relative to top left corner), y position, camera width, and camera height
	gameCamera.startFollow(this.player,false, 0.1, 0.1);
	// startFollow tells the camera to follow (OBJECTNAME, roundPxtoNearestInt, trackSpeedX, trackSpeedY, offsetX,offsetY)
	const tempBG = this.add.image(0,0, 'BG');
	tempBG.setOrigin(0,0).setDepth(0);//Sets anchor to upper left (Needed to anchor bg to Phaser's origin pt 0,0
	//set Depth helps ensure the BG stays on the bottom so everything else loads on top

	initializeAudio();
	initializeAnim();
	
	var leaves = this.add.sprite(0, 0, 'leaves').setDepth(2)
	//leaves.setScale(2);
	var leavesShadow = this.add.sprite(leaves.x+10,leaves.y+10,'leaves').setDepth(1);
	leavesShadow.tint = 0x000000;
	leavesShadow.alpha = 0.5;
	leavesShadow.setVisible(false);
	leaves.setInteractive();
      leaves.on('pointerover', function() {
		leavesShadow.setVisible(true);
		game.gulp.play();
	  });
	  leaves.on('pointerout', function() {leavesShadow.setVisible(false);}); //Ensures the shadow goes away...
      leaves.on('pointerup', function() { 
		leaves.anims.play('leavesRustle');

	  });
	 if (this.cameras.main.deadzone) {
		graphics = this.add.graphics().setScrollFactor(0);
		graphics.strokeRect(200,200,this.cameras.main.deadzone.width,this.cameras.main.deadzone.height);
	 }
	 alert(this.player.getBounds());
}

function update() {
	console.log(this.input.mousePointer.worldX + " px");//Mouse's world coordinate not updating so clicks, on hover, adn other such events wont work...
	 /*if (game.input.activePointer.isDown) {
		if (!this.isZoomed) {
			this.cameras.main.setZoom(1.5);
			this.cameras.main.centerOn(this.input.activePointer.x, this.input.activePointer.y);
			this.isZoomed = true;
		} else if (this.isZoomed) {
			this.isZoomed = false;
			this.cameras.main.setZoom(0.6);
	}
	} */
	
	this.player.setVelocity(0);
	if (this.cursors.left.isDown) {
		this.player.setVelocityX(-900);
	} else if (this.cursors.right.isDown) {
		this.player.setVelocityX(900);
	}
	
	if (this.cursors.up.isDown) {
		this.player.setVelocityY(-900);
	} else if (this.cursors.down.isDown) {
		this.player.setVelocityY(900);
	}
}

function resize() {
    var canvas = game.canvas, width = window.innerWidth * window.devicePixelRatio, height = window.innerHeight* window.devicePixelRatio;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

function initializeAudio() { //Load audio, we need to randomly play some BG noise? Def want to play when player clicks on related obj
	this.birds = game.sound.add('birds');//Needs to be attached to game object
	game.gulp = game.sound.add('gulp');
	this.squeak = game.sound.add('squeak');
	this.smAnim = game.sound.add('smAnim');
	this.wood = game.sound.add('wood');
	this.item = game.sound.add('item');
	this.selectable = game.sound.add('selectable');
}

function initializeAnim() {
	game.leavesRustle = game.anims.create({ //Literally just a setup for animations that will be called upon later...
		key: 'leavesRustle', //The key is what we will call when playing said anims
		frames: game.anims.generateFrameNumbers('frg', {start:0, end:4 /*End is the end frame, so if theres 4 frames end is 3*/}), 
		framerate:16,
		repeat:-1 //DOnt repeat -1 = repeat, 0 no repeat, 1 plays twice?
	});
}