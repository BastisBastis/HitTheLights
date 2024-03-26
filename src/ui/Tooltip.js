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


export class Tooltip extends Window {
  
  constructor(scene, x, y, {
    title=false,
    width=800,
    string=false,
    showCloseButton=false,
    depth=200,
    titleSize=80,
    labelSize=56,
    fontColor=Palette.black.string,
    yMargin=50,
    xMargin=50
  }) {
    
    const cam=scene.cameras.main
    
    let titleLabel, contentLabel, closeButton
    
    let height = yMargin
    if (title) {
      titleLabel=scene.add.text(
        x,y,title, {
          fontSize:titleSize+"px",
          color:fontColor,
          fontFamily:GlobalStuff.FontFamily
        }
      ).setOrigin(.5,.5)
      .setDepth(depth+1)
      height+=titleLabel.height+yMargin
    }
    if (string) {
      contentLabel=scene.add.text(
        x,y,string, {
          fontSize:labelSize+"px",
          color:fontColor,
          fontFamily:GlobalStuff.FontFamily,
          wordWrap: {
            width:width-xMargin*2
          }
        }
      ).setOrigin(.5,.5)
      .setDepth(depth+1)
      height+=contentLabel.height+yMargin
    }
    
    
    
    super(
      scene,
      x,
      y,
      {
        width,
        height,
        depth,
        backgroundColor:Palette.brown1.hex,
        borderColor:Palette.black.hex,
        borderThickness:12,
        blockBackground:true,
        blockAlpha:.2,
        blockerTweenDuration:400,
        cornerRadius:24,
        onClick:()=>{this.close()},
        blockerOnClick:()=>{this.close()}
      }
    )
    
    
    if (titleLabel) {
      titleLabel.y=y-height/2+yMargin+titleLabel.height/2
    }
    
    
    if (contentLabel) {
      let labelY=y-height/2+yMargin
      if (titleLabel)
        labelY+= titleLabel.height+yMargin/2
      labelY+=contentLabel.height/2
      contentLabel.y=labelY
    }
    
    ;[
      titleLabel,
      contentLabel
    ].forEach(object=>{
      if (object)
        this.children.push(object)
    })
    
  }
  
  close() {
    this.destroy()
  }
  
}