import Phaser from "phaser"
import { EventCenter } from "../helpers/EventCenter" 

//data
import { Palette } from "../data/Palette" 

const stuckInTrafficPointInterval = 1000

export class Car {
  
  constructor(scene, x, y, width, dir, road) {
    this.scene=scene
    this.x=x
    this.y=y
    this.length=width*2
    this.width=width
    this.shouldDestroy=false
    this.dir=dir
    this.road=road
    this.maxSpeed=100
    
    this.stuckInTrafficTime=0
    this.lastPassedCrossing=null
    
    
    this.graphics=scene.add.rectangle(
      x,
      y,
      width,
      this.length,
      0xff00ff,
      0
    )
    
    this.sprite=scene.add.sprite(
     x,y,"car1"
    ).setTint(0xaaffff)
    .setScale(width/320)
    //this.sprite.setTexture("car")
    
    
    
    
    this.resetSpeed()
    if (this.dir=="w") {
      this.sprite.rotation=Math.PI
    }
    else if (this.dir=="e") {
      //this.sprite.rotation=Math.PI
    }
    else if (this.dir=="n") {
      this.sprite.rotation=-Math.PI/2
    }
    else if (this.dir=="s") {
      this.sprite.rotation=Math.PI/2
    }
    
 
  }
  
  resetSpeed() {
    
    this.xSpeed=0
    this.ySpeed=0
    if (this.dir=="s") {
      this.ySpeed=this.maxSpeed
    }
    else if (this.dir=="n") {
      this.ySpeed=-this.maxSpeed
    }
    else if (this.dir=="w") {
      
      this.xSpeed=-this.maxSpeed
    }
    else if (this.dir=="e") {
      
      this.xSpeed=this.maxSpeed
    }
  }
  
  checkAheadForCrossing() {
    const point = this.getPointAhead(this.width)
    
    //console.log(point)
    
    
    this.road.crossings.forEach(crossing=>{
     


     if (crossing.containsPoint(point)) {
       const alreadyInCrossing=crossing.containsPoint(this.getPointAhead(0))
       if (!alreadyInCrossing) {
        
         
         if (!crossing.canEnter(this.dir, {x:this.x,y:this.y}, this.width)) {
           this.xSpeed = this.ySpeed = 0
         }
         
       }
     }
    })
    
    
  }
  
  getFront() {
   return this.getPointAhead(0)
  }
  
  getBack() {
   return this.getPointAhead(-this.length)
  }
  
  checkAheadForCar() {
    const point = this.getPointAhead(this.width)
    
    //console.log(point)
    
    
    this.road.cars.forEach(car=>{
     if (car==this)
       return
     

     if (car.containsPoint(point)) {
      //console.log(car.xSpeed, car.ySpeed)
        if (car.xSpeed == 0 && car.ySpeed==0) {
          this.xSpeed = this.ySpeed = 0
        }
        
      }
    })
    
    
  }
  
  getPointAhead(dist) {
    if (this.dir==="w") {
      return {
        y:this.y,
        x:this.x-this.length/2-dist
      }
    }
    else if (this.dir==="e") {
      return {
        y:this.y,
        x:this.x+this.length/2+dist
      }
    }
    else if (this.dir==="n") {
      return {
        x:this.x,
        y:this.y-this.length/2-dist
      }
    }
    else if (this.dir==="s") {
      
      return {
        x:this.x,
        y:this.y+this.length/2
        +dist
      }
    }
    console.log("dir not nswe!")
    
  }
  
  containsPoint(point) {
    return this.graphics.getBounds().contains(point.x,point.y)
  }
  
  checkForDestruction() {
    const cam = this.scene.cameras.main
    
    const pointPos={
      x:this.x,
      y:this.y
    }
    const pointAdjustment =this.length
    if (
     this.dir=="s" 
     && this.getBack().y>cam.height
    ) {
      this.shouldDestroy=true
      pointPos.y-=pointAdjustment
    }
    else if (
     this.dir=="n" 
     && this.getBack().y<0
    ) {
      pointPos.y+=pointAdjustment
      this.shouldDestroy=true
    }
    else if (
     this.dir=="e" 
     && this.getBack().x>cam.width
    ) {
      pointPos.x-=pointAdjustment
      this.shouldDestroy=true
    }
    else if (
     this.dir=="w" 
     && this.getBack().x<0
    ) {
      pointPos.x+=pointAdjustment
      this.shouldDestroy=true
    }
    
    if (this.shouldDestroy) {
      EventCenter.emit("point", {
      value:1,
      position:pointPos
    })
    }
  }
  
  handlePoints(delta) {
    //negative points
    if (this.xSpeed==0 && this.ySpeed==0) {
     const oldTime = this.stuckInTrafficTime
     this.stuckInTrafficTime+=delta
     
     const iterations = Math.floor(this.stuckInTrafficTime/stuckInTrafficPointInterval) - Math.floor(oldTime/stuckInTrafficPointInterval)
     if (iterations>0) {
       EventCenter.emit("point", {
         value:-1,
         position:{
           x:this.x,
           y:this.y
         }
       })
     }
     
    }
    if (this.xSpeed!= 0 || this.ySpeed!= 0) 
      this.stuckInTrafficTime=0
    
    //Positive points
    
    //Getting into a crossing
    this.road.crossings.forEach(crossing=>{
      if (crossing != this.lastPassedCrossing  && crossing.containsPoint({x:this.x,y:this.y})) {
        this.lastPassedCrossing=crossing
        EventCenter.emit("point", {
         value:1,
         position:{
           x:this.x,
           y:this.y
         }
       })
      }
    })
  }
  
  update(delta) {
    this.resetSpeed()
    this.checkAheadForCrossing()
    this.checkAheadForCar()
    
    this.handlePoints(delta)
    
    this.x+=delta*this.xSpeed/1000
    this.y+=delta*this.ySpeed/1000
    this.graphics.x=this.sprite.x=this.x
    this.graphics.y=this.sprite.y=this.y
    
    this.checkForDestruction()
  }
  
  destroy() {
   
   this.graphics.destroy()
  }
}
