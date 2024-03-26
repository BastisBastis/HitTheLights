import Phaser from "phaser"
import { Car } from "./car" 

//data
import { Palette } from "../data/Palette" 

const carCount=0

export class Road {
  
  constructor(scene, x,y , dir, length, width) {
    this.scene=scene
    this.x=x
    this.y=y
    this.dir=dir
    this.length=length
    this.width=width
    
    
    this.graphics= scene.add.rectangle(x,y,width,length,Palette.gray3.hex)
    if (dir=="x")
      this.graphics.rotation=Math.PI/2
      
    this.cars=[]
    this.crossings=[]
  }
  
  addCar(car) {
    this.cars.push(car)
  }
  
  addCrossing(crossing) {
    this.crossings.push(crossing)
  }
  
  spawnCar() {
    
    let dir, x, y, dx, dy
    const d= this.width*.75
    
    if (this.scene.rng.between(0,1)<1) {
      
      if (this.dir=="x") {
        x=this.x-this.length/2
        y=this.y+this.width/6
        dir="e"
        dx=-1
        dy=0
      }
      else {
        y=this.y+this.length/2
        x=this.x+this.width/6
        dir="n"
        dx=0
        dy=1
      }
      
    }
    else {
      
      if (this.dir=="x") {
        x=this.x+this.length/2
        y=this.y-this.width/6
        dir="w"
        dx=1
        dy=0
      }
      else {
        y=this.y-this.length/2
        x=this.x-this.width/6
        dir="s"
        dx=0
        dy=-1
      }
      
    }
    
    
    
    while (true) {
      
      const blockingCars=this.cars.filter(car=>{
        
        
        
        return (car.containsPoint({
          x,
          y
        }) ||
          car.containsPoint({
          x:x-dx*this.width*.48,
          y:y-dy*this.width*.48
        })
          ||
          car.containsPoint({
          x:x+dx*this.width*.48,
          y:y+dy*this.width*.48
        })
        )
      })
      
      if (blockingCars.length==0)
        break
        
      
      x+=dx*this.width
      y+=dy*this.width
      
    }
    
    const car = new Car(
      this.scene,
      x,
      y,
      this.width/4,
      dir,
      this
    )
    
    this.addCar(car)
    
    return car
    
  }
  
  crossesRoad(road) {
    
    
    const intersection= Phaser.Geom.Intersects.RectangleToRectangle(road.graphics.getBounds(), this.graphics.getBounds())
    
    if (intersection) {
      const area = Phaser.Geom.Intersects.GetRectangleIntersection(road.graphics.getBounds(), this.graphics.getBounds())
      
      
      return area
    }
    
    return false
  }
  
  removeDestroyedCars() {
    this.cars = this.cars.filter(car=>{
      return !car.shouldDestroy
    })
  }
  
  getLanePosition(dir) {
    let base = this.dir=="x"?this.y:this.x
    
    let adjustment = this.width/6
    
    if (dir=="w"||dir=="s") {
      adjustment*=-1
    }
    
    return base+adjustment
    
  }
  
  update(delta) {
    this.removeDestroyedCars()
  }
}