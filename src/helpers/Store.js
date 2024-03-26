export const Store = {
  
  
}

export const resetStore = ()=>{
  
  try { 
  for (const prop in Store) {
    if (Store.hasOwnProperty(prop)) {
        delete Store[prop];
    }
  }
  
  const tmpStore={
    
    cash:0,
    totalScore:0,
    ownedLights:[
      0,0,0
    ],
    activeLights:[
      0,0,0,0
    ],
    endlessMode:false
    
  }
  
  
  for (const key in tmpStore) {
    Store[key]=tmpStore[key]
  }
  
  } catch (er) {console.log(er.message,er.stack); throw er} 
}

resetStore()