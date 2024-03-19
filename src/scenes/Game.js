import Phaser from "phaser"

import { Store } from "../helpers/Store" 


//helpers

import { EventCenter } from "../helpers/EventCenter" 
import { GlobalStuff } from "../helpers/GlobalStuff" 
import { MusicManager } from "../helpers/MusicManager" 
import { SFXManager } from "../helpers/sfxManager"
import { LightTypeManager } from "../helpers/LightTypeManager" 

//Data
import { Palette } from "../data/Palette" 

//Objects
import { CreateMap } from "../objects/map" 

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }
  
  preload() {
   
  }
  
  create({
    levelIndex=0
  }) {
    try { 
    //Background
    this.add.rectangle(960,540,1920,1080,Palette.green1.hex).setScrollFactor(0,0)
    
    Store.cash+=5
    
    this.score=0
    this.lightTypeManager=new LightTypeManager()
    
    this.levelIndex=levelIndex
    
    this.map = CreateMap(this, levelIndex)
    
    this.gameTime=this.maxGameTime=this.map.duration
    
    this.scene.launch("ui",{
      lightTypeManager:this.lightTypeManager
    })
    
    this.spawnTimer=1000
    
    this.cars=[]
    
    this.setupEventListeners()
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
  setupEventListeners() {
    
    EventCenter.on("point", this.adjustScore, this)
    
  }
  
  adjustScore(data) {
    this.score+=data.value
    
    EventCenter.emit("updateScore",this.score)
  }
  
  removeDestroyedCars() {
    
    this.cars.forEach(car=>{
      if (car.shouldDestroy)
        car.destroy()
    })
    
    this.cars = this.cars.filter(car=>{
      return !car.shouldDestroy
    })
    
    
  }
  
  gameOver() {
    EventCenter.removeAllListeners()
    this.scene.stop("ui")
    this.scene.start("resultsmenu", {
      result:this.score,
      levelIndex:this.levelIndex
    })
  }
  
  update(time,dt) {
    try { 
    this.spawnTimer-=dt
    if (this.spawnTimer<0) {
      this.spawnTimer+=this.map.spawnTime
      const car = this.map.spawnCar()
      this.cars.push(car)
    }
    
    this.cars.forEach(car=>{
      car.update(dt)
    })
    
    this.removeDestroyedCars()
    
    this.map.update(dt)
    
    this.gameTime-=dt
    EventCenter.emit("updateTime",{time:this.gameTime, max:this.maxGameTime})
    if (this.gameTime <0) {
      this.gameOver()
    }
    
    } catch (er) {console.log(er.message,er.stack); throw er} 
  }
  
}