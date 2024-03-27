import Phaser from "phaser"


//helpers

import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { Store } from "../helpers/Store" 

//Data
import { Palette } from "../data/Palette" 

//Objects


//UI Elements
import { Button } from "../ui/Button" 
import { Window } from "./Window" 
import { Tooltip } from "./Tooltip" 




export class HighscoreWindow extends Window {
  
  constructor(scene) {
    
    const cam=scene.cameras.main
    const marginToScreen=cam.height*.1
    super(
      scene,
      cam.centerX,
      cam.centerY,
      {
        width:cam.width-marginToScreen*2,
        height:cam.height-marginToScreen*2,
        depth:100,
        backgroundColor:Palette.brown1.hex,
        borderColor:Palette.black.hex,
        borderThickness:12,
        blockBackground:true,
        blockAlpha:.2,
        blockerTweenDuration:400,
        cornerRadius:24
      }
    )
    
    
    const fontColor=Palette.black
    
    this.children.push(
      scene.add.text(cam.centerX, cam.height*.2, "HIGHSCORE", {
        fontSize:96,
        fontFamily:GlobalStuff.FontFamily,
        color:fontColor.string
      }).setOrigin(.5,.5)
      .setDepth(this.depth)
    )
    
    this.statusLabel=scene.add.text(cam.centerX, this.y, "LOADING", {
        fontSize:96,
        fontFamily:GlobalStuff.FontFamily,
        color:fontColor.string
      }).setOrigin(.5,.5)
      .setDepth(this.depth)
    this.children.push(this.statusLabel)
    
    this.loadHighscores()
    
    
    this.children.push(
      new Button(
        scene,
        this.x, 
        this.y-this.height/2+this.height*.85, 
        "CLOSE", 
        {
          fontSize:80,
          fontColor:fontColor.string,
          depth:this.depth,
          onClick:()=>this.close()
      })
    )
    
    
  }
  
  loadHighscores() {
   
   const url = 'https://htl.bastismusic.se/api/highscore?appId=htl-time'

    fetch(url).then(response=>response.json()).then(res=>{
      if (res.topScores) {
       try { 
       //console.log(res.topScores)
       this.createTimeScore(res.topScores)
       } catch (er) {console.log(er.message,er.stack); throw er} 
      } else {
       console.log(res)
       this.statusLabel.setText("Error loading highscore from server.")
      }
    }).catch(er=>{
     this.statusLabel.setText("Error loading highscore from server.")
     console.log("er: ",er)
    })
   
  }
  
  createTimeScore(scores) {
   this.statusLabel.setVisible(false)
   
    this.timeNameLabels=[]
    this.timeScoreLabels=[]
    
    const startY=this.y-this.height/2+this.height*.36
    const dy=this.height*.08
    const nameX=this.x-this.width*.3
    const scoreX=this.x+this.width*.3
    
    this.children.push(
      this.scene.add.text(
       nameX, 
       startY-dy*1.5,
       "Name:",
      {
        fontSize:80,
        fontFamily:GlobalStuff.FontFamily,
        color:Palette.black.string
      }).setOrigin(0,.5)
      .setDepth(this.depth)
    )
    
    this.children.push(
      this.scene.add.text(
       scoreX, 
       startY-dy*1.5,
       "Duration:",
      {
        fontSize:80,
        fontFamily:GlobalStuff.FontFamily,
        color:Palette.black.string
      }).setOrigin(1,.5)
      .setDepth(this.depth)
    )
    
    for (let i=0; i<5; i++) {
      if (i>=scores.length)
        return
      const nameLab=this.scene.add.text(
         nameX, 
         startY+dy*i,
         scores[i].playerName,
        {
          fontSize:64,
          fontFamily:GlobalStuff.FontFamily,
          color:Palette.black.string
        }).setOrigin(0,.5)
        .setDepth(this.depth)
      
      
      const scoreLab=this.scene.add.text(
         scoreX, 
         startY+dy*i,
         (scores[i].score/1000).toFixed(1),
        {
          fontSize:64,
          fontFamily:GlobalStuff.FontFamily,
          color:Palette.black.string
        }).setOrigin(1,.5)
        .setDepth(this.depth)
      
      this.children.push(nameLab,scoreLab)
    }
   
  }
  
  close() {
    this.destroy()
  }
  
}



/* 
const url = 'https://billyscrapbook.bastismusic.se/api/highscore?appId='+appId+'&playerId=1'

    fetch(url).then(response=>response.json()).then(res=>{
      this.updateLabels(res.topScores)
    }).catch(er=>console.log("er: ",er))
    
    fetch('https://billyscrapbook.bastismusic.se/api/highscore?appId=rcdc&playerName='+name+'&score='+score, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
 */ 