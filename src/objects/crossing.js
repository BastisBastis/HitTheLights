import Phaser from "phaser"

import { Store } from "../helpers/Store" 

let switchTime=1000
let tightPassFactor=1.1
const returnTimes=[500,1000,2000]

export class Crossing {
  
  constructor(
    scene, 
    x, 
    y, 
    size, 
    roads
  ) {
    
    this.scene=scene
    this.x = x
    this.y = y
    this.width = size
    this.height = size
    this.lightAlpha=.25
    this.redColor=0xff0000
    this.greenColor=0x00ff00
    this.yellowColor=0xffff00
    const lightHeight=size*.4
    this.roads=roads
    
    this.switching=false
    this.blockedByReturn=false
    
    
    this.boxGraphics= scene.add.rectangle(x,y,size,size,0xffffff, 0.1)
    
    
    this.lights={
      x:true,
      y:false
    }
    
    if (Math.random()<.5) {
      this.lights.x=!this.lights.x
      this.lights.y=!this.lights.y
    }
    
    
    this.lightGraphics={
      n:scene.add.rectangle(x,y-size/2-lightHeight/2,size,lightHeight,this.lights.y?this.greenColor:this.redColor,this.lightAlpha),
      s:scene.add.rectangle(x,y+size/2+lightHeight/2,size,lightHeight,this.lights.y?this.greenColor:this.redColor,this.lightAlpha),
      w:scene.add.rectangle(x-size/2-lightHeight/2,y,lightHeight,size,this.lights.x?this.greenColor:this.redColor,this.lightAlpha),
      e:scene.add.rectangle(x+size/2+lightHeight/2,y,lightHeight,size,this.lights.x?this.greenColor:this.redColor,this.lightAlpha),
    }
    
    this.boxGraphics.setInteractive()
    this.boxGraphics.on("pointerdown", ()=>{this.toggle()})
    
    
  }
  
  canEnter(dir, fromPos, carWidth) {
    carWidth=carWidth*tightPassFactor
    if ( (dir=="s"||dir=="n" ) && !this.lights.y)
      return false
    else if ( (dir=="e"||dir=="w" ) && !this.lights.x)
      return false
    
    const carsInCrossing =this.findCars()
    
    if (dir=="s"||dir=="n") {
    
      const xCars= carsInCrossing.filter(car=>{
        return car.dir=="w" || car.dir=="e"
      })
      const xCarsBlocking = xCars.filter(car=>{
        const front=car.getFront()
        const back=car.getBack()
        const maxBlockX = Math.max(front.x, back.x)
        const minBlockX = Math.min(front.x,back.x)
        
        if (maxBlockX>fromPos.x-carWidth/2 && minBlockX<fromPos.x+carWidth/2) {
          return true
        }
        return false
      })
      
      if (xCarsBlocking.length>0)
        return false
      
    }
      
    if (dir=="e"||dir=="w") {
    
      const yCars= carsInCrossing.filter(car=>{
        return car.dir=="n" || car.dir=="s"
      })
      const yCarsBlocking = yCars.filter(car=>{
        const front=car.getFront()
        const back=car.getBack()
        const maxBlockY = Math.max(front.y, back.y)
        const minBlockY = Math.min(front.y,back.y)
        
        if (maxBlockY>fromPos.y-carWidth/2 && minBlockY<fromPos.y+carWidth/2) {
          return true
        }
        return false
      })
      
      if (yCarsBlocking.length>0)
        return false
      
    }
    
    return true
  }
  
  findCars() {
    const cars=[]
    
    this.roads.forEach(road=>{
      road.cars.forEach(car=>{
        if (this.containsPoint(car.getFront()) || this.containsPoint(car.getBack()))
          cars.push(car)
      })
    })
    return cars
  }
  
  containsPoint(point) {
    return this.boxGraphics.getBounds().contains(point.x, point.y)
  }
  
  toggleWithReturn() {
    
  }
  
  
  //types
  // 0=normal
  // 1=return type (first pass)
  // 2=return type (second pass)
  toggle(type=0, option = 0) {
    try { 
    
    if (type==0&&Store.selectedLightType==1) {
      type=1
      option = Store.lightTypeOptions[1]
    }
    
    
    if (this.switching) {
      return false
    }
    
    if (this.blockedByReturn && type == 2) {
      this.blockedByReturn=false
    }
    
    if (this.blockedByReturn){
      return
    }
    
    if (type==1) {
      this.blockedByReturn=true
    }
    
    
    this.switching = {
      from:{...this.lights},
      to:{
        x:!this.lights.x,
        y:!this.lights.y
      }
    }
    
    
    
    ;["n","s","w","e"].forEach(key=>{
      this.lightGraphics[key].setFillStyle(this.yellowColor, this.lightAlpha)
    })
    this.lights.x=this.lights.y=false
    
    
    
    setTimeout(()=>{
      this.lights.x=this.switching.to.x
      this.lights.y=this.switching.to.y
      const xColor = this.lights.x?this.greenColor:this.redColor
      const yColor = this.lights.y?this.greenColor:this.redColor
      
      this.lightGraphics.w.setFillStyle(xColor, this.lightAlpha)
      this.lightGraphics.e.setFillStyle(xColor, this.lightAlpha)
      this.lightGraphics.n.setFillStyle(yColor, this.lightAlpha)
      this.lightGraphics.s.setFillStyle(yColor, this.lightAlpha)
      
      this.switching=false
      
      
      
      if (type==1) {
        
        setTimeout(()=>this.toggle(2),returnTimes[option])
      }
      
    }, switchTime)
    
    
    
    
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  performSwitch() {
    
  }
  
}