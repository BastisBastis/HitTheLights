import Phaser from "phaser"


//helpers

import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { resetStore } from "../helpers/Store" 
//Data
import { Palette } from "../data/Palette" 

//Objects

//UI elements
import { Button } from "../ui/Button" 

import { HighscoreWindow } from "../ui/HighscoreWindow" 

import { ModalTextInput } from "../ui/ModalTextInput" 


export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("mainmenu")
  }
  
  
  create({
    
  }) {
    try { 
    resetStore()
    const cam = this.cameras.main
    
    this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, Palette.gray2.hex)
    
    this.showTitle()
    
    
    
    this.startButton = new Button(
      this,
      cam.centerX, 
      cam.height*.775, 
      "START",
      {
        onClick:()=>this.startGame()
      }
    )
    
    this.startButton = new Button(
      this,
      cam.centerX, 
      cam.height*.9, 
      "HIGHSCORE",
      {
        onClick:()=>this.showHighscore()
      }
    )
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  showHighscore() {
    const hsWindow= new HighscoreWindow(this)
  }
  
  showTitle() {
    
    const cam=this.cameras.main
    const startY=cam.height*.12
    const circleSize=cam.height*.1
    const dy=cam.height*.23
    const x=cam.centerX
    const borderThickness=32
    
    const textFormat={
      fontSize:"60px",
      color:Palette.gray1.string,
      fontFamily:GlobalStuff.FontFamily
    }
    
    this.add.circle(
      x,
      startY+dy*0,
      circleSize,
      Palette.black.hex
    ).setStrokeStyle(
      borderThickness,
      Palette.red2.hex
    )
    this.add.text(
      x,
      startY+dy*0,
      "HIT",
      textFormat
    ).setOrigin(.5,.5)
    
    this.add.circle(
      x,
      startY+dy*1,
      circleSize,
      Palette.black.hex
    ).setStrokeStyle(
      borderThickness,
      Palette.yellow2.hex
    )
    this.add.text(
      x,
      startY+dy*1,
      "THE",
      textFormat
    ).setOrigin(.5,.5)
    
    this.add.circle(
      x,
      startY+dy*2,
      circleSize,
      Palette.black.hex
    ).setStrokeStyle(
      borderThickness,
      Palette.green2.hex
    )
    this.add.text(
      x,
      startY+dy*2,
      "LIGHTS",
      textFormat
    ).setOrigin(.5,.5)
    
    /*
    this.add.text(cam.centerX, cam.height*.25, "HIT THE LIGHTS", {
      fontSize:128,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    */
    
  }
  
  startGame() {
    this.scene.start("game", {
      levelIndex:0
    })
  }
  
  update(time, dt) {
    
  }
  
}