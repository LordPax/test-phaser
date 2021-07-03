import Phaser from 'phaser'
type ImageWithDynamicBody = Phaser.Types.Physics.Arcade.ImageWithDynamicBody
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
type ParticuleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager
type ParticuleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
type Sprite = Phaser.GameObjects.Sprite
type Image = Phaser.GameObjects.Image
type Key = Phaser.Input.Keyboard.Key

export class Menu extends Phaser.Scene {
    private button: Image

    constructor() {
        super({ key: 'menu' })
    }

    public preload(): void {
        this.load.image('logo', 'assets/images/phaser3-logo.png')
        this.load.image('sky', 'assets/images/space3.png')
        this.load.image('play', 'assets/images/play_button.png')
    }

    public create(): void {
        const sky: Image = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'sky')
        const logo: Image = this.add.image(this.game.renderer.width / 2, 100, 'logo')
        this.button = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play')

        this.button.setInteractive()
        this.button.on('pointerup', () => {
            this.scene.start('game')
        })
    }
}