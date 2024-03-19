export const Levels = []

//Level 1
try { 

const getEvenLevelData=(
  duration,
  spawnTime,
  seed,
  scale,
  columns,
  rows,
  color1,
  color2) =>{
    
  const width=1960
  const height=1080
    
  const data={
    duration,
    spawnTime,
    scale,
    seed
  }
  const roads=[]
  for (let i=0; i<columns; i++) {
    roads.push({
      x:width/(columns+1)*(i+1),
      y:height/2,
      length:height,
      dir:"y"
    })
  }
  
  for (let i=0; i<rows; i++) {
    roads.push({
      y:height/(rows+1)*(i+1),
      x:width/2,
      length:width,
      dir:"x"
    })
  }
  
  const blocks = []
  for (let row=0; row<rows+1; row++) {
    for (let col=0; col<columns+1;col++) {
      
      const color = [color1,color2][(row+col)%2]
      
      blocks.push({
        width:width/(columns+1),
        height:height/(rows+1),
        x:width/(columns+1)*col,
        y:height/(rows+1)*row,
        color
      })
      
    }
  }
  
  return {...data, blocks, roads}
}

Levels.push(
  getEvenLevelData(
    40000,
    3500,
    10015,
    1,
    1, //columns
    1, //rows
    "orange1",
    "yellow1"
  )
)

Levels.push(
  getEvenLevelData(
    60000,
    3000,
    10015,
    1,
    2, //columns
    1, //rows
    "blue1",
    "yellow1"
  )
)

Levels.push(
  getEvenLevelData(
    80000,
    2500,
    10015,
    1,
    2, //columns
    2, //rows
    "orange1",
    "green1"
  )
)

Levels.push(
  getEvenLevelData(
    100000,
    2500,
    10015,
    1,
    3, //columns
    2, //rows
    "orange1",
    "green1"
  )
)

Levels.push(
  getEvenLevelData(
    100000,
    1000,
    10020,
    1,
    3, //columns
    3, //rows
    "orange1",
    "green1"
  )
)



} catch (er) {console.log(er.message,er.stack); throw er} 