import Phaser from 'phaser'
type ImageWithDynamicBody = Phaser.Types.Physics.Arcade.ImageWithDynamicBody
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
type ParticuleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager
type ParticuleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
type Sprite = Phaser.GameObjects.Sprite
type Key = Phaser.Input.Keyboard.Key

const randInt = (min:number, max:number):number => 
    Math.floor(Math.random() * (max - min + 1) + min)

export class SimpleGame extends Phaser.Scene {
    private perso: SpriteWithDynamicBody

    constructor() {
        super('test')
    }

    public preload(): void {
        // this.load.setBaseURL('https://localhost:8080')

        this.load.image('sky', 'assets/images/space3.png')
        this.load.image('logo', 'assets/images/phaser3-logo.png')
        this.load.image('red', 'assets/images/red.png')
        this.load.spritesheet('perso', 'assets/images/perso_sprite.png', {
            frameHeight : 130,
            frameWidth : 120
        })

    }

    public create(): void {
        let balls: ImageWithDynamicBody[] = []

        const sky = this.add.image(400, 300, 'sky')
        sky.setInteractive()
        sky.on('pointerdown', (event:any) => {
            const ball: ImageWithDynamicBody = this.physics.add.image(event.downX, event.downY, 'red')
            const randX: number = randInt(-200, 200)
            const randY: number = randInt(-200, 200)

            ball.setVelocity(randX, randY)
            ball.setBounce(0.7, 0.7)
            ball.setCollideWorldBounds(true)
        
            const particles: ParticuleEmitterManager = this.add.particles('red')
            const emitter: ParticuleEmitter = particles.createEmitter({
                speed: 100,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD'
            })

            emitter.startFollow(ball)

            balls = [...balls, ball]
        })

        this.perso = this.physics.add.sprite(100, 100, 'perso')
        // perso.setScale(2)
        this.perso.setCollideWorldBounds(true)

        this.anims.create({
            key: 'idle',
            frameRate: 15,
            repeat: -1,
            repeatDelay: 2000,
            frames: this.anims.generateFrameNumbers('perso', {
                frames: [0, 1, 2, 1, 0]
            }) 
        })

        this.anims.create({
            key: 'right',
            frameRate: 20,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('perso', {
                start: 70,
                end: 79
            }) 
        })

        this.anims.create({
            key: 'left',
            frameRate: 20,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('perso', {
                start: 50,
                end: 59
            }) 
        })

        // this.perso.play('idle', true)
    }

    public update(time: number, delta: number): void {
        const keyZ: Key = this.input.keyboard.addKey('Z')
        const keyQ: Key = this.input.keyboard.addKey('Q')
        const keyD: Key = this.input.keyboard.addKey('D')

        if (keyZ.isDown) 
            this.perso.setVelocityY(-500)
        if (keyQ.isDown) 
            this.perso.setVelocityX(-200)
        if (keyD.isDown) 
            this.perso.setVelocityX(200)
        if (keyQ.isUp && keyD.isUp) 
            this.perso.setVelocityX(0)

        if (this.perso.body.velocity.x > 0) 
            this.perso.play('right', true)
        else if (this.perso.body.velocity.x < 0) 
            this.perso.play('left', true)
        else 
            this.perso.play('idle', true)
    }
}