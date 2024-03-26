import Phaser from "phaser"

import { Store } from "../helpers/Store" 

import { EventCenter } from "../helpers/EventCenter" 

let switchTime=1000
let tightPassFactor=1.1
const returnTimes=[500,1000,2000]
const loopFrequencies=[1000,2000,3000]
const cleverLookDistance=50

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
    this.looping=false
    this.loopFrequency=1000
    this.loopId=false
    this.clever=false
    
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
  
  requestShowIcon(index) {
    
    const key=[
      false,
      false,
      "LoopIcon",
      "CleverIcon"
    ][index]
    EventCenter.emit("showLightTypeIcon",{
      key:key,
      position:{
        x:this.x-this.width/2,
        y:this.y-this.height/2
      }
    })
  }
  
  requestHideIcon() {
    EventCenter.emit("hideLightTypeIcon",{
        x:this.x-this.width/2,
        y:this.y-this.height/2
       }
      )
  }
  
  
  //types
  // 0=normal
  // 1=return type (first pass)
  // 2=return type (second pass)
  // 3=loop
  // 4=clever
  toggle(type=0, option = 0) {
    try { 
    
    
    
    if (type==0 && !this.looping && Store.selectedLightType==2 && Store.activeLights[2] >= Store.ownedLights[1]) {
      console.log("Already used all looping lights - "+Store.activeLights[2])
      return
    }
    
    if (type==0 && !this.clever && Store.selectedLightType==3 && Store.activeLights[3] >= Store.ownedLights[2]) {
      console.log("Already used all auto-lights - "+ Store.activeLights[3])
      return
    }
    
    if (this.looping && type!=3) {
      Store.activeLights[2]--
      this.requestHideIcon()
      clearInterval(this.loopId)
      this.loopId=false
      this.looping=false
      EventCenter.emit("lightTypeAmountUpdated")
    }
    
    if (Store.selectedLightType==3 && type == 0) {
      if (!this.clever) {
        
        Store.activeLights[3]++
        this.clever=true
        this.requestShowIcon(3)
      } else {
        Store.activeLights[3]--
        this.clever=false
        this.requestHideIcon()
      }
      EventCenter.emit("lightTypeAmountUpdated")
      return
    }
    
    if (this.clever && type!==4) {
      Store.activeLights[3]--
      this.clever=false
      this.requestHideIcon()
    }
    
    
    
    if (type==0&&Store.selectedLightType==1) {
      type=1
      option = Store.lightTypeOptions[1]
    }
    
    
    if (this.switching) {
      EventCenter.emit("lightTypeAmountUpdated")
      return false
    }
    
    if (this.blockedByReturn && type == 2) {
      this.blockedByReturn=false
    }
    
    if (this.blockedByReturn){
      EventCenter.emit("lightTypeAmountUpdated")
      return
    }
    
    if (type==1) {
      this.blockedByReturn=true
    }
    
    
    
    if (type==0 && Store.selectedLightType==2) {
      if (!this.looping) {
        this.requestShowIcon(2)
        Store.activeLights[2]++
      }
      this.loopFrequency=loopFrequencies[Store.lightTypeOptions[2]] + switchTime
      this.looping=true
      this.loopId=setInterval(
        ()=>{
          this.toggle(3)
        }, 
        this.loopFrequency
      )
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
    
    
    
    EventCenter.emit("lightTypeAmountUpdated")
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  
  cleverCheck() {
    
    let numXcars=0
    let numYcars=0
    
    
    this.roads.forEach(road=>{
      
      if (road.dir=="x") {
        
        //check west
        let startX=this.x-this.width/2 //west side of Crossing
          - road.width*0.15 // -car lookahead
          - road.width*0 // back of car
        let y=road.getLanePosition("e")
        let firstCheck=true
        let x=startX
        while (true) {
          //this.scene.add.rectangle(x,y,10,10,0xffff00)
          
          let carsInPoint=road.cars.filter(car=>{
            return car.containsPoint({x,y})
          })
          if (carsInPoint.length==0 ) {
            if (firstCheck) {
              x-=road.width*.4
              firstCheck=false
              continue
            }
            break
          }
          firstCheck=false
            
          const car = carsInPoint[0]
          x = car.x-car.width-car.length*.7
          numXcars+=1
        }
        
        
        
      
            
        //check east
       startX=this.x+this.width/2 //east side of Crossing
          + road.width*0.15 // -car lookahead
          + road.width*0 // back of car
        y=road.getLanePosition("w")
        
        
        firstCheck= true
        x=startX
        while (true) {
          //this.scene.add.rectangle(x,y,10,10,0xffff00)
          let carsInPoint=road.cars.filter(car=>{
            //console.log("lanePos",y,car.y)
            return car.containsPoint({x,y})
          })
          if (carsInPoint.length==0 ) {
            if (firstCheck) {
              x+=road.width*.4
              firstCheck=false
              continue
            }
            break
          }
          firstCheck=false
          const car = carsInPoint[0]
          x = car.x+car.width+car.length*.7
          numXcars+=1
        }
        
        
        
      }
      
      if (road.dir=="y") {
        
        //check north
        let startY=this.y-this.width/2 //north side of Crossing
          - road.width*0.15 // -car lookahead
          - road.width*0 // back of car
        let x=road.getLanePosition("s")
        let firstCheck=true
        let y=startY
        while (true) {
          //this.scene.add.rectangle(x,y,10,10,0xffff00)
          let carsInPoint=road.cars.filter(car=>{
            return car.containsPoint({x,y})
          })
          if (carsInPoint.length==0 ) {
            if (firstCheck) {
              y-=road.width*.4
              firstCheck=false
              continue
            }
            break
          }
          firstCheck=false
          const car = carsInPoint[0]
          y = car.y-car.width-car.length*.7
          numYcars+=1
        }
        
        
        
      
            
        //check south
       startY=this.y+this.width/2 //east side of Crossing
          + road.width*0.15 // -car lookahead
          + road.width*0 // back of car
        x=road.getLanePosition("n")
        
        
        firstCheck=true
        y=startY
        while (true) {
          //this.scene.add.rectangle(x,y,10,10,0xffff00)
          let carsInPoint=road.cars.filter(car=>{
            //console.log("lanePos",y,car.y)
            return car.containsPoint({x,y})
          })
          if (carsInPoint.length==0 ) {
            if (firstCheck) {
              y+=road.width*.4
              firstCheck=false
              continue
            }
            break
          }
          firstCheck=false
          const car = carsInPoint[0]
          y = car.y+car.width+car.length*.7
          numYcars+=1
        }
        
        
        
      }
      
    })
    
    
    
    if (numXcars>numYcars) {
      if (this.lights.y) {
        this.toggle(4)
      }
    }
    else if (numXcars<numYcars) {
      if (this.lights.x) {
        this.toggle(4)
      }
    }
    
  }
  
  update(delta) {
    if (this.clever)
      this.cleverCheck()
    
  }
  
}