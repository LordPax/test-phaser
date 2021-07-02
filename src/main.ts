import Phaser from 'phaser'
import { SimpleGame } from './scene'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 }
        }
    },
    scene: SimpleGame
}

export default new Phaser.Game(config)