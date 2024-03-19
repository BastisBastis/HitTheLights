const hexs=`fab1a0-brown1
e17055-brown2
ffeaa7-yellow1
fdcb6e-yellow2
ffddaa-orange1
fd79a8-pink1
e84393-pink2
dfe6e9-gray1
b2bec3-gray2
636e72-gray3
74b9ff-blue1
0984e3-blue2
ff7675-red1
d63031-red2
ffffff-white
2d3436-black
55efc4-green1
00b894-green2
81ecec-teal1
00cec9-teal2
a29bfe-purple1
6c5ce7-purple2`

export const Palette={}

try { 
hexs.split("\n").forEach(s=>{
  const [hex,name]=s.split("-")
  Palette[name]={
    hex:Number("0x"+hex),
    string:"#"+hex
  }
})
} catch (er) {console.log(er.message,er.stack); throw er} 
