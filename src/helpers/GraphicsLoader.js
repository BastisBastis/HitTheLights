import  Car1URL from "../assets/sprites/Car1.png"
import  NormalIconURL from "../assets/images/NormalIcon.png"
import  ReturnIconURL from "../assets/images/ReturnIcon.png"
import  LoopIconURL from "../assets/images/LoopIcon.png"
import  CleverIconURL from "../assets/images/CleverIcon.png"

export const preloadGraphics = (scene)=>{
  try { 
  
  scene.load.image("car1", Car1URL)
  scene.load.image("NormalIcon", NormalIconURL)
  scene.load.image("ReturnIcon", ReturnIconURL)
  scene.load.image("LoopIcon", LoopIconURL)
  scene.load.image("CleverIcon", CleverIconURL)
  
  
  } catch (er) {console.log(er.message,er.stack); throw er} 
  
}