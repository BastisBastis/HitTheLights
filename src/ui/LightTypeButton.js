import Phaser from "phaser"

import { GlobalStuff } from "../helpers/GlobalStuff" 


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
    this.height=100
    
    const borderThickness=10
    this.bgColor=0xffffff
    this.selectedBgColor=0x00bbff
    const borderColor=0x000000
    
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
    
    this.bg.setInteractive()
    .on("pointerdown",onClick, this)
  }
  
  setSelected(value) {
    this.selected=value
    
    const color=value?this.selectedBgColor:this.bgColor
    
    this.bg.setFillStyle(color)
  }
  
  toggle() {
    this.setSelected(!this.selected)
  }
  
  setLabelText(value) {
    this.label.setText(value)
  }
  
}