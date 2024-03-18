import Phaser from "phaser"


//helpers

import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 

//Objects


export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("mainmenu")
  }
  
  
  create({
    
  }) {
    const cam = this.cameras.main
    
    this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0xaaaaff)
    
    this.add.text(cam.centerX, cam.height*.25, "HIT THE LIGHTS", {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.white.string
    }).setOrigin(.5,.5)
    
    this.add.text(cam.centerX, cam.height*.65, "START", {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.white.string
    }).setOrigin(.5,.5).setInteractive().on("pointerdown", this.startGame, this)
    
  }
  
  startGame() {
    this.scene.start("game")
  }
  
  update(time, dt) {
    
  }
  
}