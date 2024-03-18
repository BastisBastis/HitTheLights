import { EventCenter } from "./EventCenter" 
import { Store } from "./Store" 

const numOptions=[
  1,
  3,
  3,
  1
]

//Labeltypes
//0 = no label
//1 = option selected
//2 = items left

const optionLabels=[
  null,
  [0.5,1,2],
  [1,2,3],
  null
]



export class LightTypeManager {
  
  constructor () {
    
    Store.selectedLightType=0
    Store.lightTypeOptions=[
      0,
      0,
      0,
      0
    ]
    
    this.setupEventListeners()
    
  }
  
  setupEventListeners() {
    
    EventCenter.on("cycleLightTypeOptions", this.cycleLightTypeOptions, this)
    EventCenter.on("selectLightType", this.selectLightType, this)
    
  }
  
  selectLightType(index) {
    if (index==Store.selectLightType)
      return
    
    Store.selectedLightType=index
    
    EventCenter.emit("lightTypeSelected", index)
  }
  
  cycleLightTypeOptions(index) {
    if (numOptions[index]>1) {
      
      Store.lightTypeOptions[index] = (Store.lightTypeOptions[index]+1) % numOptions[index] 
      
      EventCenter.emit("lightTypeOptionUpdated",{
        lightTypeIndex:index,
        optionIndex:Store.lightTypeOptions[index]
      })
      
    }
  }
  
  getOptionLabel(index,option) {
    const labels=optionLabels[index]
    if (labels && labels.length>option) {
      return labels[option]
    }
    
    return false
  }
  
  
}