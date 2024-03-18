const hexs=`391513-brown1
fff594-yellow1
ff9614-orange1
fec07d-pink1
888888-gray1
8897bc-blue1
ef462e-red1
ffffff-white
000000-black
138510-green1`

export const Palette={}

hexs.split("\n").forEach(s=>{
  const [hex,name]=s.split("-")
  Palette[name]={
    hex:Number("0x"+hex),
    string:"#"+hex
  }
})
