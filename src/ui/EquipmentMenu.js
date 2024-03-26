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


const equipmentCost=[]

export class EquipmentMenu extends Window {
  
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
      scene.add.text(cam.centerX, cam.height*.2, "BUY NEW LIGHTS", {
        fontSize:96,
        fontFamily:GlobalStuff.FontFamily,
        color:fontColor.string
      }).setOrigin(.5,.5)
      .setDepth(this.depth)
    )
    
    const equipmentStartY = this.y-this.height*.2
    const equipmentDy = this.height*.17
    
    const ownedLabelX=this.x - this.width*.4
    
    const iconX = this.x - this.width*.25
    const titleX = this.x
    const costX = this.x + this.width*.19
    const buyButtonX = this.x + this.width*.4
    
    this.equipmentData=[
      {
        title:"Return-Light",
        description:"This light returns to the previous setting after 0.5, 1 or 2 seconds.\n\nPurchasing this light once allows you to use it simultaneously on multiple intersections.",
        cost:20,
        iconKey:"ReturnIcon",
        singleUnlock:true
      },
      {
        title:"Interval-Light",
        description:"This light alternates between settings.\n\nEach purchase allows you to activate this function on one intersection at the time. Purchase more to use it at several intersections.",
        cost:[30,40,50,60,70,80,90,100,110,120,130,140,150],
        iconKey:"LoopIcon",
        singleUnlock:false
      },
      {
        title:"Auto-Light",
        description:"This light detects which direction has the most cars waiting and adjusts accordingly.\n\nEach purchase allows you to activate this function on one intersection at the time. Purchase more to use it at several intersections.",
        cost:[50,65,80,100,120,140,165,190],
        iconKey:"CleverIcon",
        singleUnlock:false
      },
    ]
    
    this.ownedLabels=[]
    this.buyButtons=[]
    this.costLabels=[]
    
    for (let i = 0; i<this.equipmentData.length; i++) {
      const data=this.equipmentData[i]
      this.children.push(
        new Button(
          scene,
          titleX, 
          equipmentStartY+equipmentDy*i, 
          data.title, 
          {
            width:540,
            height:100,
            fontSize:80,
            fontColor:fontColor.string,
            depth:this.depth,
            onClick:()=>{
              try { 
              const tooltip=new Tooltip(
                scene,
                this.x,
                this.y,
                {
                  title:data.title,
                  string:data.description
                }
              )
              } catch (er) {console.log(er.message,er.stack); throw er} 
            }
        })
      )
      
      this.children.push(
        scene.add.sprite(
          iconX, 
          equipmentStartY+equipmentDy*i, 
          data.iconKey, 
        ).setScale(.6)
        .setDepth(this.depth)
      )
      
      const ownedLabel=scene.add.text(
        ownedLabelX, 
        equipmentStartY+equipmentDy*i, 
        data.singleUnlock?"Owned":"Owned: 2", 
        {
          fontSize:56,
          fontFamily:GlobalStuff.FontFamily,
          color:fontColor.string
      }).setOrigin(.5,.5)
      .setDepth(this.depth)
      this.ownedLabels.push(ownedLabel)
      this.children.push(ownedLabel)
      
      const buyButton= new Button(
        scene,
        buyButtonX, 
        equipmentStartY+equipmentDy*i, 
        "BUY", 
        {
          width:200,
          height:100,
          fontSize:80,
          fontColor:fontColor.string,
          depth:this.depth,
          onClick:()=>this.buyItem(i)
      })
      
      this.buyButtons.push(buyButton)
      this.children.push(buyButton)
      
      let cost
      
      if (isNaN(data.cost)) {
        cost = data.cost[Math.min(Store.ownedLights[i],data.cost.length-1)]
      } else {
        cost=data.cost
      }
      
      const costLabel=scene.add.text(
        costX, 
        equipmentStartY+equipmentDy*i, 
        "Cost: "+cost, 
        {
          fontSize:64,
          fontFamily:GlobalStuff.FontFamily,
          color:fontColor.string
      }).setOrigin(0,.5)
      .setDepth(this.depth)
      
      this.costLabels.push({
        costData:data.cost,
        label:costLabel
      })
      this.children.push(costLabel)
      
    }
    
    
    //bottom row
    const bottomY=this.y+this.height*.35
    
    this.children.push(
      scene.add.text(
        this.x-this.width*.3, 
        bottomY, 
        "CASH:", 
        {
          fontSize:80,
          fontFamily:GlobalStuff.FontFamily,
          color:fontColor.string
      }).setOrigin(1.1,.5)
      .setDepth(this.depth)
    )
    
    this.cashLabel=scene.add.text(
      this.x-this.width*.3, 
      bottomY, 
      0, 
      {
        fontSize:80,
        fontFamily:GlobalStuff.FontFamily,
        color:fontColor.string
    }).setOrigin(0,.5)
    .setDepth(this.depth)
    this.children.push(this.cashLabel)
    
    
    
    
    this.children.push(
      new Button(
        scene,
        this.x+this.width*.3, 
        bottomY, 
        "CLOSE", 
        {
          fontSize:80,
          fontColor:fontColor.string,
          depth:this.depth,
          onClick:()=>this.close()
      })
    )
    
    this.updateLabels()
  }
  
  updateLabels() {
    this.cashLabel.text=Store.cash
    
    for (let i = 0; i<this.equipmentData.length; i++) {
      const data = this.equipmentData[i]
      let ownedString
      
      if (data.singleUnlock) {
        if (Store.ownedLights[i]==0) 
          ownedString=""
        else
          ownedString="Owned"
      } else {
        if (Store.ownedLights[i]==0) 
          ownedString=""
        else
          ownedString="Owned: "+Store.ownedLights[i]
      }
      if (this.ownedLabels[i])
        this.ownedLabels[i].setText(ownedString)
      
      if (this.buyButtons[i])
        this.buyButtons[i].setVisible(!(data.singleUnlock && Store.ownedLights[i]>0))
        
      let cost
      const costData=this.costLabels[i].costData
      
      if (isNaN(costData)) {
        cost = costData[Math.min(Store.ownedLights[i],costData.length-1)]
      } else {
        cost=costData
      }
      this.costLabels[i].label.setText("Cost: "+cost)
    }
    
  }
  
  buyItem(index) {
    const data = this.equipmentData[index]
    
    let cost
      
    if (isNaN(data.cost)) {
      cost = data.cost[Math.min(Store.ownedLights[index],data.cost.length-1)]
    } else {
      cost=data.cost
    }
    
    if (Store.cash < cost) {
      const tooltip=new Tooltip(
        this.scene,
        this.x,
        this.y,
        {
          
          string:"You cannot afford that light!",
          width:800
        }
      )
      return
    }
    if (data.singleUnlock && Store.ownedLights[index]>0) {
      const tooltip=new Tooltip(
        this.scene,
        this.x,
        this.y,
        {
          
          string:"You already own that light!",
          width:800
        }
      )
      return
    }
    
    Store.cash-=cost
    Store.ownedLights[index]++
    const tooltip=new Tooltip(
      this.scene,
      this.x,
      this.y,
      {
        
        string:data.title+" purchased for "+cost+"!",
        width:1000
      }
    )
    
    this.updateLabels()
    this.scene.updateCash()
  }
  
  close() {
    this.destroy()
  }
  
}