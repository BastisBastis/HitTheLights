import Phaser from "phaser"
import { GlobalStuff } from "../helpers/GlobalStuff"
import { EventCenter } from "../helpers/EventCenter" 

import { Palette } from "../data/Palette" 

import { 
  hexToRgb,
  rgbToHex,
  hexStringToRgb,
  rgbToHexString
} from "../helpers/Utils" 

import {Window} from "./Window"



export class Button extends Window {
  
  constructor(scene,x,y,string,config={}) {
    const {
      fontSize=80,
      hoverFontSize=fontSize,
      downFontSize=hoverFontSize,
      width=460,
      height=120,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor=Palette.black.string,
      hoverFontColor=fontColor,
      downFontColor=fontColor,
      cornerRadius=8,
      borderThickness=2,
      backgroundColor=Palette.gray1.hex,
      hoverBackgroundColor=Palette.blue1.hex,
      downBackgroundColor=Palette.blue2.hex,
      backgroundAlpha=1,
      hoverBackgroundAlpha=1,
      downBackgroundAlpha=1,
      tweenDuration=200,
      
      onClick=()=>false,
      iconKey=null,
      requireDown=true
    }=config
    
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      cornerRadius,
      borderThickness,
      backgroundColor,
      onClick:undefined,
    })
    
    //backgroundAlpha=1
    this.destroyed=false
    this.bg.setFillStyle(backgroundColor,backgroundAlpha)
    this.tweenDuration=tweenDuration
    
    this.fontColor=fontColor
    this.hoverFontColor=hoverFontColor
    this.downFontColor=downFontColor
    
    this.backgroundColor=backgroundColor
    this.hoverBackgroundColor=hoverBackgroundColor
    this.downBackgroundColor=downBackgroundColor
    this.backgroundAlpha=backgroundAlpha
    this.hoverBackgroundAlpha=hoverBackgroundAlpha
    this.downBackgroundAlpha=downBackgroundAlpha
    this.fontSize=fontSize
    this.hoverFontSize=hoverFontSize
    this.downFontSize=downFontSize
    this.onClick=onClick
    
    this.isButton=true
      
    this.label=scene.add.text(x,y,string,{
      fontSize:fontSize,
      fontFamily:fontFamily,
      color:fontColor
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
    this.down=false
    
    if (iconKey) {
     this.setIcon(iconKey)
    }
    this.backgroundTween=null
      
    this.bg.on('pointerover', () => {
      this.setHover()
      }).on('pointerout', () => {
          this.setOut()
        })
      .on('pointerdown', () => {
       
          this.setDown()
        })
      .on('pointerup', () => {
        
        this.setUp()
        })
        
        this.children.push(this.label)
  }
  
  setOut() {
   this.tweenButton(
    this.backgroundColor,
    this.backgroundAlpha,
    this.fontColor,
    this.fontSize
   )
    this.down=false

  }
  
  click() {
   this.onClick()
      EventCenter.emit("playAudio",{key:"click"})
  }
  
  setUp() {
   if (this.down) {
          
     this.down=false
     try { 
     
      this.click()
     } catch (er) {console.log(er.message,er.stack); throw er} 
   }
   this.tweenButton(
    this.backgroundColor,
    this.backgroundAlpha,
    this.fontColor,
    this.fontSize
   )
        
  }
  
  setDown() {
   this.tweenButton(
    this.downBackgroundColor,
    this.downBackgroundAlpha,
    this.downFontColor,
    this.downFontSize
   )
   this.down=true

   EventCenter.emit("playAudio",{key:"buttonDown"})
  }
  
  setHover() {
   if (this.down)
       return
     this.tweenButton(
      this.hoverBackgroundColor,
      this.hoverBackgroundAlpha,
      this.hoverFontColor,
      this.hoverFontSize
     )
         
     
     EventCenter.emit("playAudio",{key:"hover"})
     
       
  
  }
  
 tweenButton(toColor,toAlpha,toLabelColor,toFontSize) {
  try { 
  
  
  if (this.backgroundTween)
    this.backgroundTween.stop()
    
  if (this.destroyed)
   return
    
  const tmpLabelColorRgb=hexStringToRgb(this.label.style.color)
  const toLabelColorRgb=hexStringToRgb(toLabelColor)
  
    
  const tmp= {
   ...hexToRgb(this.bg.fillColor),
   a:this.bg.fillAlpha,
   lr:tmpLabelColorRgb.r,
   lg:tmpLabelColorRgb.g,
   lb:tmpLabelColorRgb.b,
   fontSize:Number(this.label.style.fontSize.split("p")[0])
  }
  
  const targetColor={
   ...hexToRgb(toColor),
   a:toAlpha,
   lr:toLabelColorRgb.r,
   lg:toLabelColorRgb.g,
   lb:toLabelColorRgb.b,
   fontSize:toFontSize
  }
  
  this.backgroundTween=this.scene.tweens.add({
    targets:tmp,
    duration:this.tweenDuration,
    ...targetColor,
  }).on("update",()=>{
   try { 
    this.bg.setFillStyle(rgbToHex(
      tmp.r,
      tmp.g,
      tmp.b
    ),tmp.a)
    
    this.label.setColor(rgbToHexString(
      Math.round(tmp.lr),
      Math.round(tmp.lg),
      Math.round(tmp.lb),
    ))
    
    this.label.setFontSize(tmp.fontSize)
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }).on("complete",()=>{
    this.backgroundTween=null
  })
  } catch (er) {console.log(er.message,er.stack); throw er} 
 }
 
 
  
 setText(val) {
   this.label.text=val
 }
  
  setVisible(val) {
    super.setVisible(val)
    this.label.visible=val
    return this
  }
  
  setIcon(key) {
   if (this.icon) {
    this.icon.destroy()
   }
   if (!key) {
    this.icon=null
    return this
   }
    
    
    this.icon=this.scene.add.image(
     this.x,
     this.y,
     key
    ).setDepth(this.depth)
     .setOrigin(0.5,0.5)
     
    const scale=Math.min(
     this.width/this.icon.width,
     this.height/this.icon.height
    )*0.8
    
    this.icon.setScale(scale)
    
    return this
  }
  
  destroy() {
   this.destroyed=true
    super.destroy()
    this.label.destroy()
    if (this.icon)
     this.icon.destroy()
  }
  
}