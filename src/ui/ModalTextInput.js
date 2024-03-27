import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import Phaser from "phaser"
import {GlobalStuff} from "../helpers/GlobalStuff"
import {EventCenter} from "../helpers/EventCenter"

import {Window} from "./Window"
import { Button } from "./Button"


import { Palette } from "../data/Palette" 

export class ModalTextInput extends Window {
  
  constructor(
    scene,
    config={}
  ) {
    
    const {
      string="Enter text",
      x=scene.cameras.main.centerX,
      y=scene.cameras.main.centerY,
      width=600,
      height=400,
      depth=1,
      fontFamily=GlobalStuff.FontFamily,
      fontColor=Palette.black.string,
      buttonFontColor=fontColor,
      hoverFontColor,
      borderColor=Palette.black.hex,
      onConfirm=()=>false,
      onCancel=()=>false,
      confirmString="OK",
      cancelString="Cancel",
      buttonFontSize=56,
      labelFontSize=56,
      blockBackground=true,
      inputFontSize=40,
      inputBorderThickness=2,
      inputBorderColor=fontColor,
      inputFontColor=Palette.white.string,
      inputBackground=Palette.gray3.string,
      inputMaxCharacters=24,
      stackButtons=false
    }=config
    
    
   
    super(scene,x,y,{
      ...config,
      width,
      height,
      depth,
      borderThickness:2,
      blockBackground:blockBackground,
      blockerTweenDuration:300,
      blockAlpha:0.2,
      borderColor
    })
    
    const top=y-height/2
    const left=x-width/2
    
    const btnConfig={
      fontSize:buttonFontSize,
      width:200,
      height:100,
      depth:depth,
      borderColor:borderColor,
      backgroundColor:Palette.white.hex,
      fontColor:fontColor,
      hoverBackgroundColor:Palette.red1.hex,
      downBackgroundColor:Palette.green1.hex,
      downFontColor:fontColor,
    }
      
    this.label=scene.add.text(x,top+height*0.2,string,{
      fontSize:labelFontSize,
      fontFamily:fontFamily,
      color:fontColor,
      wordWrap:{
        width:width*0.9
      },
      align:"center"
    }).setOrigin(0.5,0.5)
      .setDepth(depth)
      
      
    this.inputText = new InputText(scene, x, y, width*0.8, height*0.2, {
      backgroundColor: inputBackground,
      fontFamily: fontFamily,
      fontSize: inputFontSize+"px",
      border:inputBorderThickness+"px",
      borderColor:inputBorderColor,
      color:inputFontColor,
      
      //paddingTop: "0px",
      //paddingBottom: "0px",
      align: "center",
      maxLength:inputMaxCharacters,
      id: "modalInput"
    }).setOrigin(0.5, 0.5)
      .setDepth(depth)
    scene.add.existing(this.inputText)
      
      
    const buttonPos=[
      {
        x:stackButtons?x:left+width*0.75,
        y:top+height*(stackButtons?0.75:0.8)
      },
      {
        x:stackButtons?x:left+width*0.25,
        y:top+height*(stackButtons?0.9:0.8)
      }
    ]
      
    this.cancel=new Button(scene,
      buttonPos[1].x,
      buttonPos[1].y,
      cancelString,{
        ...btnConfig,
        
        onClick:()=>{
          this.destroy()
          onCancel()
        }
      }
    )
      
     
    this.confirm=new Button(scene,
      buttonPos[0].x,
      buttonPos[0].y,
      confirmString,{
        ...btnConfig,
        
        onClick:()=>{
          
          onConfirm(this.inputText.text)
          this.destroy()
          
        }
      }
    )
     
    this.children.push(
      this.label,
      this.inputText,
      this.cancel,
      this.confirm
    )
  }
  
  static prompt(scene,config={}) {
    return new Promise((resolve,reject)=>{
      try { 
      const c=new ModalTextInput(scene,{
        ...config,
        onCancel:()=>{
          resolve(null)
        },
        onConfirm:(value)=>{
          resolve(value)
        }
      })
      } catch (er) {console.log(er.message,er.stack); throw er} 
    })
  }
  
  /*
  destroy() {
    
    
    this.label.destroy()
    this.cancel.destroy()
    this.confirm.destroy()
    this.inputText.destroy()
  
    super.destroy()
    
    
  }
  */
}

