import Phaser from "phaser"


//Helpers
import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 


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
    lightTypeManager
  }) {
    try { 
    const cam=this.cameras.main
    
    this.add.text(cam.width*.25, cam.height*.04, "TIME:", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
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
    
    this.add.text(cam.width*.75, cam.height*.04, "SCORE:", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.scoreLabel=this.add.text(cam.width*.75, cam.height*.1, "0", {
      fontSize:80,
      fontFamily:GlobalStuff.FontFamily,
      color:Palette.black.string
    }).setOrigin(.5,.5)
    
    this.lightTypeManager=lightTypeManager
    this.setupLightTypeButtons()
    
    this.setupEventListeners()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupEventListeners() {
    EventCenter.on("updateTime",this.updateTime, this)
    EventCenter.on("updateScore",this.updateScore, this)
    EventCenter.on("lightTypeSelected",this.handleLightTypeSelected, this)
    EventCenter.on("lightTypeOptionUpdated",this.handleLightTypeOptionUpdated, this)
    
    
  }
  
  handleLightTypeOptionUpdated({lightTypeIndex,optionIndex}) {
    
    this.lightTypeButtons[lightTypeIndex].setLabelText(
      this.lightTypeManager.getOptionLabel(lightTypeIndex,optionIndex)
    )
    
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
    
    this.timeProgress.setProgress(time/max)
  }
  
  update(time,dt) {
    
    
    
  }
}