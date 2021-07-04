import Phaser from 'phaser'
type ImageWithDynamicBody = Phaser.Types.Physics.Arcade.ImageWithDynamicBody
type ImageWithStaticBody = Phaser.Types.Physics.Arcade.ImageWithStaticBody
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
type ParticuleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager
type ParticuleEmitter = Phaser.GameObjects.Particles.ParticleEmitter
type Sprite = Phaser.GameObjects.Sprite
type Image = Phaser.GameObjects.Image
type Graphics = Phaser.GameObjects.Graphics
type Key = Phaser.Input.Keyboard.Key
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

const randInt = (min:number, max:number):number => 
    Math.floor(Math.random() * (max - min + 1) + min)

export class SimpleGame extends Phaser.Scene {
    private perso: SpriteWithDynamicBody
    private angle: number
    public static distVis: number = 100
    public static velBall: number = 1000
    private vis: Graphics
    private platform: ImageWithStaticBody[]

    constructor() {
        super({ key: 'game' })
        this.angle = 0
    }

    public preload(): void {
        // this.load.setBaseURL('https://localhost:8080')

        this.load.image('sky', 'assets/images/space3.png')
        this.load.image('logo', 'assets/images/phaser3-logo.png')
        this.load.image('red', 'assets/images/red.png')
        this.load.image('platform', 'assets/images/platform.png')
        this.load.spritesheet('perso', 'assets/images/perso_sprite.png', {
            frameHeight : 130,
            frameWidth : 120
        })

    }

    public create(): void {
        // let balls: ImageWithDynamicBody[] = []
        const sky: Image = this.add.image(400, 300, 'sky')

        this.platform = [
            this.physics.add.staticImage(200, 480, 'platform'),
            this.physics.add.staticImage(400, 380, 'platform'),
            this.physics.add.staticImage(600, 480, 'platform')
        ]

        this.input.keyboard.on('keydown-SPACE', (event:any) => {
            const { vx, vy } = this.convAngle(this.angle)

            const ball: ImageWithDynamicBody = this.physics.add.image(this.perso.x, this.perso.y, 'red')
            ball.setVelocity(SimpleGame.velBall * vx, SimpleGame.velBall * vy)
            ball.setBounce(0.7, 0.7)
            ball.setCollideWorldBounds(true)
            ball.setScale(0.8)

        
            const particules: ParticuleEmitterManager = this.add.particles('red')
            const emitter: ParticuleEmitter = particules.createEmitter({
                speed: 100,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD'
            })

            emitter.startFollow(ball)

            // balls = [...balls, ball]
            // setTimeout(() => balls[balls.length - 1].setVisible(false), 5000)
            setTimeout(() => {
                particules.destroy()
                ball.destroy()
            }, 5000)
        })

        this.perso = this.physics.add.sprite(100, 100, 'perso')
        this.perso.setScale(0.8)
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

        this.vis = this.add.graphics({
            fillStyle: {
                color: 0xff0000,
                alpha: 1
            }
        })
    }

    public update(time: number, delta: number): void {
        this.vis.clear()

        this.physics.world.collide(this.perso, this.platform)

        const keyZ: Key = this.input.keyboard.addKey('Z')
        const keyQ: Key = this.input.keyboard.addKey('Q')
        const keyD: Key = this.input.keyboard.addKey('D')
        const curKey: CursorKeys = this.input.keyboard.createCursorKeys()

        const { vx, vy } = this.convAngle(this.angle)
        this.vis.fillCircle(this.perso.x + SimpleGame.distVis * vx, this.perso.y + SimpleGame.distVis * vy, 5)

        if (keyZ.isDown && this.perso.body.velocity.y === 0) 
            this.perso.setVelocityY(-600)
        if (keyQ.isDown) 
            this.perso.setVelocityX(-200)
        if (keyD.isDown) 
            this.perso.setVelocityX(200)
        if (keyQ.isUp && keyD.isUp) 
            this.perso.setVelocityX(0)

        if (curKey.left.isDown)
            this.angle -= 1
        if (curKey.right.isDown)
            this.angle += 1
        
        if (this.perso.body.velocity.x > 0) 
            this.perso.play('right', true)
        else if (this.perso.body.velocity.x < 0) 
            this.perso.play('left', true)
        else 
            this.perso.play('idle', true)
    }

    public convAngle(angle:number):{ vx:number, vy:number } {
        const vx:number = Math.cos(angle * Math.PI / 180)
        const vy:number = Math.sin(angle * Math.PI / 180)

        return { vx, vy }
    }

}