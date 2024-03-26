import Phaser from "phaser"


//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { Store } from "../helpers/Store" 

//Data
import { Palette } from "../data/Palette" 

//UI Elements
import { ProgressBar } from "../ui/ProgressBar" 
import { LightTypeButton } from "../ui/LightTypeButton" 


export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  preload() {
    
  }
  
  create({
    lightTypeManager,
    startScore=0
  }) {
    try { 
    const cam=this.cameras.main
    
    this.add.text(cam.width*.25, cam.height*.04, "TIME:", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    if (Store.endlessMode) {
      this.timeProgress= this.add.text(cam.width*.25, cam.height*.1, "0", {
        fontSize:80,
        fontFamily:GlobalStuff.FontFamily,
        color:Palette.black.string
      }).setOrigin(.5,.5)
    } else {
      this.timeProgress=new ProgressBar(
        this,
        cam.width*.25,
        cam.height*.1,
        400,
        50,
        {
          borderThickness:8
        }
      )
    }
    
    
    this.add.text(cam.width*.75, cam.height*.04, "SCORE:", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.scoreLabel=this.add.text(cam.width*.75, cam.height*.1, startScore, {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.lightTypeManager=lightTypeManager
    this.setupLightTypeButtons()
    
    this.setupEventListeners()
    
    this.activeLightIcons=[]
    
    this.handleLightTypeAmountUpdated()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupEventListeners() {
    EventCenter.on("updateTime",this.updateTime, this)
    EventCenter.on("updateScore",this.updateScore, this)
    EventCenter.on("lightTypeSelected",this.handleLightTypeSelected, this)
    EventCenter.on("lightTypeOptionUpdated",this.handleLightTypeOptionUpdated, this)
    EventCenter.on("lightTypeAmountUpdated",this.handleLightTypeAmountUpdated, this)
    
    EventCenter.on("showLightTypeIcon", this.showActiveLightTypeIcon, this)
    EventCenter.on("hideLightTypeIcon", this.hideActiveLightTypeIcon, this)
    EventCenter.on("point", this.showPoint, this)
    
    this.input.keyboard.on("keydown", this.keyDown, this)
    
  }
  
  keyDown(e) {
    if (e.key=="1") {
      if (this.lightTypeButtons[0]) {
        this.lightTypeButtons[0].click()
      }
    } else if (e.key=="2") {
      if (this.lightTypeButtons[1]) {
        this.lightTypeButtons[1].click()
      }
    } else if (e.key=="3") {
      if (this.lightTypeButtons[2]) {
        this.lightTypeButtons[2].click()
      }
    } else if (e.key=="4") {
      if (this.lightTypeButtons[3]) {
        this.lightTypeButtons[3].click()
      }
    }
  }
  
  showPoint({
    value,
    position
  }) {
    
    const bgColor=value>0?Palette.green2.hex:Palette.red1.hex
    
    const bg=this.add.circle(
      position.x,
      position.y,
      40,
      bgColor
    ).setStrokeStyle(8,Palette.black.hex)
    
    const label=this.add.text(
      position.x,
      position.y,
      value,
      {
        fontFamily:GlobalStuff.FontFamily,
        fontSize:44,
        color:Palette.black.string
      }
    ).setOrigin(.5,.5)
    
    this.tweens.add({
        targets: [bg, label],
        y: "-=150",
        alpha: "0",
        scale:.5,
        ease: 'Power1',
        duration: 1000,
        onComplete: ()=>{
          if (bg && bg.destroy) {
            bg.destroy()
            label.destroy()
            
          }
        }
        
    });
    
  }
  
  hideActiveLightTypeIcon(position) {
    const icons=this.activeLightIcons.filter(icon=>(icon.position.x==position.x&&icon.position.y==position.y))
    
    if (icons.length>0) {
      console.log(position, icons[0].position,icons.length)
      
      const icon=icons[0]
      icon.bg.destroy()
      icon.icon.destroy()
      this.activeLightIcons=this.activeLightIcons.filter(otherIcon=>otherIcon!=icon)
    }
  }
  
  showActiveLightTypeIcon({
    key,
    position
  }) {
    
    this.hideActiveLightTypeIcon(position)
    
    const bg = this.add.circle(
      position.x,
      position.y,
      50,
      Palette.gray3.hex
    ).setStrokeStyle(8,Palette.black.hex)
    const icon =this.add.sprite(
      position.x,
      position.y,
      key
    )
    icon.setScale(60/icon.width)
    
    this.activeLightIcons.push(
      {
        key,
        position,
        bg,
        icon
      }
    )
    
    
  }
  
  handleLightTypeOptionUpdated({lightTypeIndex,optionIndex}) {
    
    this.lightTypeButtons[lightTypeIndex].setLabelText(
      this.lightTypeManager.getOptionLabel(lightTypeIndex,optionIndex)
    )
    
  }
  
  handleLightTypeAmountUpdated() {
    for (let i = 2; i<4; i++) {
      
      if (this.lightTypeButtons[i]) {
        
        const button=this.lightTypeButtons[i]
        button.setLabelText(
          Store.ownedLights[i-1]-Store.activeLights[i]
        )
        
      }
    }
  }
  
  handleLightTypeSelected(index) {
    
    for (let i = 0; i<this.lightTypeButtons.length; i++) {
      const btn = this.lightTypeButtons[i]
      if (btn.selected && i!=index) {
        btn.setSelected(false)
      } else if (i==index) {
        btn.setSelected(true)
      }
    }
    
  }
  
  setupLightTypeButtons() {
    
    this.lightTypeButtons=[]
    
    const types=4
    
    for (let i = 0; i<types; i++) {
      if (i>0 && Store.ownedLights[i-1]==0) {
        this.lightTypeButtons.push(false)
        continue
      }
        
      this.lightTypeButtons.push(
        new LightTypeButton(
          this,
          100,
          120+i*160,
          i,
          ()=>{
            try { 
            this.lightTypeButtonClicked(i)
            } catch (er) {console.log(er.message,er.stack); throw er} 
          },
          this.lightTypeManager.getOptionLabel(i,0)
        )
      )
    }
    
    this.lightTypeButtons[0].toggle()
    
  }
  
  lightTypeButtonClicked(index) {
    if (this.lightTypeButtons[index].selected) {
      EventCenter.emit("cycleLightTypeOptions", index)
    } else {
      EventCenter.emit("selectLightType", index)
    }
  }
  
  
  updateScore(value) {
    this.scoreLabel.setText(value)
  }
  
  updateTime({
    time,
    max
  }) {
    if (Store.endlessMode) {
      
      this.timeProgress.setText(
        (time/1000).toFixed(1)
      )
    } else {
      this.timeProgress.setProgress(time/max)
    }
    
  }
  
  update(time,dt) {
    
    
    
  }
}