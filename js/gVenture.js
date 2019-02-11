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

//Preloading image, sound, and any other assets that need to get loaded here
function preload () {
    //this.load.image('logo', 'assets/pics/logo.png');
	this.load.image('BG', 'assets/pics/bg.png');
	this.load.image('leaves', 'assets/pics/logo.png');
	/* End Image loading */
	/*Spritesheets Below*/
	this.load.spritesheet('leaves','assets/dude.png',
		{ frameWidth: 32, frameHeight: 48 } //Gets the width and height ofe very frame to play
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
	this.physics.world.setBounds(0,0, 4800, 2700, true, true, true, true); //Set bounds, first parameter will be top left x bound coordinate, second paramter the top left y bound, followed by width, then height
	this.input.setDefaultCursor('url(assets/pics/cursor.png), pointer');
	const gameCamera = this.cameras.main; //Get our camera object
	//Camera's inputs are its x position (relative to top left corner), y position, camera width, and camera height
	gameCamera.startFollow(game.input.mousePointer,false, 0.1, 0.1, game.input.mousePointer.x/2+120, game.input.mousePointer.y-120);
	// startFollow tells the camera to follow (OBJECTNAME, roundPxtoNearestInt, trackSpeedX, trackSpeedY, offsetX,offsetY)

    const tempBG = this.add.image(-1200, -600, 'BG');//Need to do this as it offsets a bit otherwise?
	tempBG.setOrigin(0,0).setDepth(0);//Sets anchor to upper left (Needed to anchor bg to Phaser's origin pt 0,0
	//set Depth helps ensure the BG stays on the bottom so everything else loads on top

	initializeAudio();
	initializeAnim();
	
	var leaves = this.add.sprite(0, 0, 'leaves').setDepth(2);
	var leavesShadow = this.add.sprite(leaves.x+10,leaves.y-10,'leaves').setDepth(1);
	//leavesShadow.tint = 0xFFFF00;
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
}

function update() {
	console.log(this.input.mousePointer.worldX + " px");//Mouse's world coordinate not updating so clicks, on hover, adn other such events wont work...
	//Need to change way camera works potentially, or figure out way to get the mouses coordinate to update 
}


/*function interactWithObject(Sprite sprite) {
	//switch case for dealing with objects based off of Tag more than likely?
	switch (true) {
		sprite = 0;
		
		
	}
}*/

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
		frames: game.anims.generateFrameNumbers('leaves', {start:0, end:3 /*End is the end frame, so if theres 4 frames end is 3*/}), 
		framerate:20,
		repeat:0 //DOnt repeat
	});
}