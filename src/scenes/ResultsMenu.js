import Phaser from "phaser"


//helpers

import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { Store } from "../helpers/Store" 

//Data
import { Palette } from "../data/Palette" 
import { Levels } from "../data/Levels" 

//Objects


export default class ResultsMenu extends Phaser.Scene {
  constructor() {
    super("resultsmenu")
  }
  
  
  create({
    result = 0,
    levelIndex=0
  }) {
    
    try { 
    
    console.log(Store)
    
    this.levelIndex=levelIndex
    const cam = this.cameras.main
    
    this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0xaaaaff)
    
    this.add.text(cam.centerX, cam.height*.25, "Result:", {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.white.string
    }).setOrigin(.5,.5)
    this.add.text(cam.centerX, cam.height*.35, result, {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.white.string
    }).setOrigin(.5,.5)
    
    
    if (levelIndex< Levels.length-1) {
      this.add.text(cam.centerX, cam.height*.65, "NEXT LEVEL", {
        fontSize:128,
        fontFamily:GlobalStuff.FontFamily,
        color:Palette.white.string
      }).setOrigin(.5,.5).setInteractive().on("pointerdown", this.nextLevel, this)
    }
    
    
    this.add.text(cam.centerX, cam.height*.8, "MAIN MENU", {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.white.string
    }).setOrigin(.5,.5).setInteractive().on("pointerdown", this.openMainMenu, this)
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  nextLevel() {
    this.scene.start("game", {
      levelIndex:this.levelIndex+1
    })
  }
  
  openMainMenu() {
    this.scene.start("mainmenu")
  }
  
  update(time, dt) {
    //console.log(time)
  }
  
}