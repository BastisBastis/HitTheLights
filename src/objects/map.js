import Phaser from 'phaser'


import { Road } from "./road" 
import { Crossing } from "./crossing" 

//Data
import { Levels } from "../data/Levels" 
import { Palette } from "../data/Palette" 

const baseRoadWidth=120

export class Map {
  constructor (scene, data) {
    
    this.scene=scene
    
    this.scene.rng=new Phaser.Math.RandomDataGenerator([data.seed.toString()])
    //this.scene.rng.init(data.seed)
    
    const cam = this.scene.cameras.main
    
    this.roads=[]
    this.crossings=[]
    this.spawnTime=data.spawnTime
    this.duration=data.duration
    
    this.createBlocks(data.blocks)
    
    data.roads.forEach(roadData=>{
      this.createRoad(
        roadData.x,
        roadData.y,
        roadData.dir,
        roadData.length,
        data.scale*baseRoadWidth
      )
    })
    
    /*
    this.createRoad(
      cam.centerX/3*2,
      cam.centerY,
      "y",
      cam.height,
      120
    )
    
    
    this.createRoad(
      cam.centerX/3*4,
      cam.centerY,
      "y",
      cam.height,
      120
    )
    
    this.createRoad(
      cam.centerX,
      cam.centerY,
      "x",
      cam.width,
      120
    )
    
    
    this.createRoad(
      cam.centerX,
      cam.centerY/3*2,
      "x",
      cam.width,
      120
    )
    
    
    this.createRoad(
      cam.centerX,
      cam.centerY/3*4,
      "x",
      cam.width,
      120
    )
    
    */
    
  }
  
  createRoad(x, y, dir, width, length) {
    
    const road = new Road(
      this.scene,
      x,
      y,
      dir,
      width,
      length
    )
    
    this.roads.forEach(oldRoad=>{
      const crossingPosition = oldRoad.crossesRoad(road)
      if (crossingPosition) {
        const crossing = new Crossing(
          this.scene,
          crossingPosition.x+crossingPosition.width/2,
          crossingPosition.y+crossingPosition.height/2,
          crossingPosition.width,
          [oldRoad,road]
        )
        this.crossings.push(crossing)
        road.addCrossing(crossing)
        oldRoad.addCrossing(crossing)
      }
    })
    
    this.roads.push(road)
  }
  
  createBlocks(data) {
    
    data.forEach(block=>{
      this.scene.add.rectangle(
        block.x,
        block.y,
        block.width,
        block.height,
        Palette[block.color].hex
      ).setOrigin(0,0)
    })
    
  }
  
  spawnCar() {
    
    if (this.roads.length==0) {
      console.log("No roads to spawn car")
      return false
    }
    
    const i=this.scene.rng.between(0,this.roads.length-1)
    
    
    
    return this.roads[i].spawnCar()
    
  }
  
  update(delta) {
    this.roads.forEach(road=>{
      road.update(delta)
    })
  }
}

export const CreateMap = (scene, index = 0)=> {
  return new Map(scene, Levels[index])
  
  
}