import Phaser from "phaser"

import { GlobalStuff } from "../helpers/GlobalStuff" 

import { Button } from "./Button" 

import { Palette } from "../data/Palette" 

export class LightTypeButton {
  
  constructor(
    scene,
    x,
    y,
    type,
    onClick,
    labelText
  ) {
    
    this.width=100
    this.height=this.width
    
    const borderThickness=10
    this.bgColor=Palette.gray1.hex
    this.selectedBgColor=Palette.green1.hex
    const borderColor=0x000000
    
    /*
    
    this.bg=scene.add.rectangle(
      x,
      y,
      this.width,
      this.height,
      this.bgColor
    ).setStrokeStyle(
      borderThickness,
      borderColor
    )
    */
    
    this.bg=new Button(
      scene,
      x,
      y,
      "",
      {
        width:this.width,
        height:this.height,
        depth:0,
        onClick: onClick,
        backgroundColor:this.bgColor
      }
   
    )
    
    const texture = [
      "NormalIcon",
      "ReturnIcon",
      "LoopIcon",
      "CleverIcon"
    ][type]
    
    this.icon=scene.add.image(
      x,
      y,
      texture
    )
    this.icon.setScale(this.width/this.icon.width)
    
    this.labelBg=scene.add.circle(x+this.width/2,y+this.height/2,40,0x000000)
    this.labelBg.setVisible(labelText)
    this.label=scene.add.text(
      x+this.width/2,
      y+this.height/2,
      "",
      {
        fillColor:"white",
        fontFamily:GlobalStuff.FontFamily,
        fontSize:"48px"
      }
    ).setOrigin(.5,.5)
    
    if (labelText) {
      this.label.setText(labelText)
    }
    
    this.selected=false
    
    /*
    this.bg.setInteractive()
    .on("pointerdown",onClick, this)
    */
  }
  
  setSelected(value) {
    this.selected=value
    
    const color=value?this.selectedBgColor:this.bgColor
    
    this.bg.setBackgroundColor(color)
  }
  
  toggle() {
    this.setSelected(!this.selected)
  }
  
  setLabelText(value) {
    this.label.setText(value)
  }
  
}