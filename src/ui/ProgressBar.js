import Phaser from "phaser"
import { Palette } from "../data/Palette" 

export class ProgressBar {
  constructor(scene,x,y,width,height,{
    borderThickness=4,
    borderColor=Palette.black.hex,
    fillColor=Palette.black.hex,
    animateProgress=false,
    animationDuration=0,
    origin={x:0.5,y:0.5}
  }={}) {
    
    this.scene=scene
    this._x=x
    this._y=y
    this._width=width
    this._height=height
    
    this._origin=origin
    this._fillColor=fillColor
    this._borderColor=borderColor
    this._borderThickness=borderThickness
    this.animateProgress=animateProgress
    this.animationDuration=animationDuration
    
    this._progress=1
    
    this.setupFrame()
    this.setupFill()
  }
  
  setupFrame() {
    
    this.frame=this.scene.add.rectangle(1,1,200,200)
      
      .setOrigin(0,0)
    this.layoutFrame()
  }
  
  setupFill() {
    this.fill=this.scene.add.rectangle(0,0,0,0,this.fillColor)
      .setOrigin(0,0)
    this.layoutFill()
  }
  
  layoutFrame() {
    const x=this.x-this.origin.x*this.width
    const y=this.y-this.origin.y*this.height
    
    this.frame.x=x
    this.frame.y=y
    this.frame.geom.setSize(this.width, this.height); 
    this.frame.setSize(this.width, this.height).updateDisplayOrigin().updateData();
    this.frame.setStrokeStyle(
        this.borderThickness,
        this.borderColor
      )
  }
  
  layoutFill(animate=false) {
    const x=this.x+this.borderThickness*0.5-this.origin.x*this.width
    const y=this.y+this.borderThickness*0.5-this.origin.y*this.height
    const width=(this.width-this.borderThickness)*this.progress
    const height=this.height-this.borderThickness
    this.fill.x=x
    this.fill.y=y
    this.fill.width=width
    this.fill.height=height
    
  }
  
  setProgress(value) {
    this._progress=Math.max(0,Math.min(1,value))
    this.layoutFill(this.animateProgress)
  }
  
  set progress(value) {
    this.setProgress(value)
  }
  
  get progress() {
    return this._progress
  }
  
  set fillColor(val) {
    this._fillColor=val
    this.layoutFill()
  }
  
  get fillColor() {
    return this._fillColor
  }
  
  set borderColor(val) {
    this._borderColor=val
    this.layoutFrame()
  }
  
  get borderColor() {
    return this._borderColor
  }
  
  set borderThickness(val) {
    this._borderThickness=val
    this.layoutFrame()
  }
  
  get borderThickness() {
    return this._borderThickness
  }
  
  set height(val) {
    this._height=val
    this.layoutFill()
    this.layoutFrame()
  }
  
  get height() {
    return this._height
  }
  
  set width(val) {
    this._width=val
    this.layoutFill()
    this.layoutFrame()
  }
  
  get width() {
    return this._width
  }
  
  set origin(val) {
    this._origin=val
    this.layoutFill()
    this.layoutFrame()
  }
  
  get origin() {
    return this._origin
  }
  
  set y(val) {
    this._y=val
    this.layoutFill()
    this.layoutFrame()
  }
  
  get y() {
    return this._y
  }
  
  set x(val) {
    this._x=val
    this.layoutFill()
    this.layoutFrame()
  }
  
  get x() {
    return this._x
  }
  
  destroy() {
    this.frame.destroy()
    this.fill.destroy()
  }
}