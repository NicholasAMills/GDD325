//This will be our config seetup for Phaser...mostly self explanatory, we specify our games width, height, the viewing type (Options include Phaser.AUTO, CANVAS, WebGl Rendering modes
//and then our (currently) defined scenes.
var config = {
    type: Phaser.WebGl,
    parent: 'phaser-example',
    width: 1920,
    height: 1080,
    scene: { //Appears Phaser knows to automatically go to preload?
        preload: preload,
        create: create
    }
};
//Pass our config to the Phaser game object
var game = new Phaser.Game(config);

//Preloading image, sound, and any other assets that need to get loaded here
function preload () {
    this.load.image('logo', 'assets/pics/logo.png');
}
//Actual creation/placement of our preloaded assets
function create () {
    var logo = this.add.image(window.screen.width/2, window.screen.height/2, 'logo');

    this.tweens.add({
        targets: logo,
        y: 300,
        duration: 2500,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });
}