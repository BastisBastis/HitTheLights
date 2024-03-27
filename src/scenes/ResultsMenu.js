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


//UI Elements
import { Button } from "../ui/Button" 
import { EquipmentMenu } from "../ui/EquipmentMenu" 
import { ModalTextInput } from "../ui/ModalTextInput" 
import { HighscoreWindow } from "../ui/HighscoreWindow" 


export default class ResultsMenu extends Phaser.Scene {
  constructor() {
    super("resultsmenu")
  }
  
  
  create({
    result = 0,
    levelIndex=0,
    time=0
  }) {
    
    try { 
    
    MusicManager.play(1,this)
    if (levelIndex<Levels.length-1) {
      Store.cash+=result
      Store.totalScore+=result
    }
    
    
    this.levelIndex=levelIndex
    const cam = this.cameras.main
    
    this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, Palette.brown2.hex)
    
    
    
    if (levelIndex<Levels.length-2)
      this.showNormalResults(result, levelIndex)
    else if (levelIndex<Levels.length-1)
      this.showPreEndlessResults(result)
    else
      this.showPostEndlessResults(time) 
    
    
    
    const buttonWidth=600
    const buttonStartY=cam.height*.60
    const buttonDy=cam.height*.15
    
    const btns=[]
    
    if (levelIndex< Levels.length-1) {
      
      btns.push({
        title:"BUY NEW LIGHTS",
        onClick:()=>this.openEquipmentMenu()
      })
      btns.push({
        title:"NEXT LEVEL",
        onClick:()=>this.nextLevel()
      })
      
    }
    
    btns.push({
        title:"MAIN MENU",
        onClick:()=>this.openMainMenu()
      })
    
    for (let i =0; i< btns.length; i++) {
      
      const btn = new Button(
        this,
        cam.width/btns.length/2+cam.width/btns.length*i, 
        cam.height*.8, 
        btns[i].title,
        {
          onClick:btns[i].onClick,
          width:buttonWidth
        }
      )
      
    }
    
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  startHighscoreProcess(time, highscore) {
    
    ModalTextInput.prompt(this,{
      string:"Enter name for highscore:"
    }).then((name)=>{
      fetch('https://htl.bastismusic.se/api/highscore?appId=htl-time&playerName='+name+'&score='+time, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        new HighscoreWindow(this)
      }).catch(er=>{
        console.log("error submitting highscore", er)
      })
    }).catch((er)=>{
      console.log(er)
    })
    
  }
  
  checkHighscore(time) {
    
    const numScoresToShow=5
    
    const url = 'https://htl.bastismusic.se/api/highscore?appId=htl-time'

    fetch(url).then(response=>response.json()).then(res=>{
      if (res.topScores) {
       try { 
       
       if (res.topScores.length<numScoresToShow || res.topScores[numScoresToShow-1].score < time) {
         
         this.startHighscoreProcess(time, res.topScores)
         
       } else {
         console.log("Did not make it to Highscore list")
       }
       
       } catch (er) {console.log(er.message,er.stack); throw er} 
      } else {
       console.log(res)
      }
    }).catch(er=>{
      
      console.log("er: ",er)
    })
  }
  
  showPostEndlessResults(time) {
    const cam = this.cameras.main
    
    const titleString = "GAME OVER"
    
    this.add.text(cam.centerX, cam.height*.15, titleString, {
      fontSize:102,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    
    this.add.text(cam.centerX, cam.height*.32, "Traffic light operators always get thrown out eventually, and now it's your turn. Thank you for your service!", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string,
      align:"center",
      wordWrap:{
        width:cam.width*.8
      }
      }).setOrigin(.5,.5)
    
    
    
    this.add.text(cam.centerX, cam.height*.5, "You lasted: "+(time/1000).toFixed(1)+" seconds", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.add.text(cam.centerX, cam.height*.6, "Training popularity: "+Store.totalScore, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.checkHighscore(time)
  }
  
  showPreEndlessResults(result) {
    const cam = this.cameras.main
    
    const titleString = "TRAINING COMPLETE"
    
    this.add.text(cam.centerX, cam.height*.15, titleString, {
      fontSize:102,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    
    this.add.text(cam.centerX, cam.height*.27, "Your training is complete. See how long you last in the real city before you lose the drivers' support!", {
      fontSize:72,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string,
      align:"center",
      wordWrap:{
        width:cam.width*.8
      }
      }).setOrigin(.5,.5)
    
    
    this.add.text(cam.centerX, cam.height*.4, "Cash received: "+result, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.add.text(cam.centerX, cam.height*.5, "Total popularity: "+Store.totalScore, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.cashLabel= this.add.text(cam.centerX, cam.height*.6, "Total cash: "+Store.cash, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
  }
  
  showNormalResults(result, levelIndex) {
    
    const cam = this.cameras.main
    
    const titleString = "LEVEL COMPLETE"
    
    this.add.text(cam.centerX, cam.height*.15, titleString, {
      fontSize:102,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    
    this.add.text(cam.centerX, cam.height*.3, "You were so popular that the drivers has donated some cash:", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string,
      align:"center",
      wordWrap:{
        width:cam.width*.8
      }
      }).setOrigin(.5,.5)
    
    
    this.add.text(cam.centerX, cam.height*.4, result, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.add.text(cam.centerX, cam.height*.5, "Total popularity: "+Store.totalScore, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.cashLabel= this.add.text(cam.centerX, cam.height*.6, "Total cash: "+Store.cash, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
  }
  
  updateCash() {
    this.cashLabel.setText(
      "Total cash: "+Store.cash
    )
  }
  
  openEquipmentMenu() {
    this.equipmentMenu= new EquipmentMenu(this)
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