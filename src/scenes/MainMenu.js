import Phaser from "phaser"


//helpers

import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"

//Data
import { Palette } from "../data/Palette" 

//Objects

//UI elements
import { Button } from "../ui/Button" 


export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("mainmenu")
  }
  
  
  create({
    
  }) {
    const cam = this.cameras.main
    
    this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, Palette.yellow1.hex)
    
    this.add.text(cam.centerX, cam.height*.25, "HIT THE LIGHTS", {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.startButton = new Button(
      this,
      cam.centerX, 
      cam.height*.65, 
      "START",
      {
        onClick:()=>this.startGame()
      }
    )
    
    
    
  }
  
  startGame() {
    this.scene.start("game")
  }
  
  update(time, dt) {
    
  }
  
}