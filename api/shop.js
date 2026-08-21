import fs from 'fs'
import path from 'path'
function bag(){
  const mem=globalThis.__shops||(globalThis.__shops={})
  try{
    const disk=JSON.parse(fs.readFileSync(path.join(process.cwd(),'shops.json'),'utf8'))
    for(const k of Object.keys(disk)) if(!mem[k]) mem[k]=disk[k]
  }catch{}
  return mem
}
function read(req){return new Promise(r=>{let s='';req.on('data',d=>s+=d);req.on('end',()=>r(s))})}
export default async function handler(req,res){
  const mem=bag()
  res.setHeader('Content-Type','application/json;charset=utf-8')
  res.setHeader('Cache-Control','no-store')
  if(req.method==='POST'){
    let b={};try{b=JSON.parse(await read(req)||'{}')}catch{b={}}
    const slug=String(b.slug||'').replace(/[^a-z0-9가-힣-]/gi,'').slice(0,32)
    if(!slug||slug==='rinon'||slug==='_t'){res.status(400).send('{"ok":false}');return}
    const shop={name:b.name||slug,phone:b.phone||'',place:b.place||'',hours:b.hours||'',rest:b.rest||'',treatments:Array.isArray(b.treatments)?b.treatments:[]}
    mem[slug]=shop
    try{
      const p=path.join(process.cwd(),'shops.json')
      let disk={}
      try{disk=JSON.parse(fs.readFileSync(p,'utf8'))}catch{}
      disk[slug]=shop
      fs.writeFileSync(p,JSON.stringify(disk))
    }catch{}
    res.status(200).send(JSON.stringify({slug,...shop}))
    return
  }
  const u=new URL(req.url,'http://x')
  const slug=u.searchParams.get('slug')||''
  let shop=mem[slug]
  if(!shop){
    try{shop=JSON.parse(fs.readFileSync(path.join(process.cwd(),'shops.json'),'utf8'))[slug]}catch{}
    if(shop) mem[slug]=shop
  }
  if(!shop){res.status(404).send('{"ok":false}');return}
  res.status(200).send(JSON.stringify({slug,...shop}))
}
