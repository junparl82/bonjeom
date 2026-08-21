import fs from 'fs'
import path from 'path'
const LOCK=new Set(['rinon','haru','_t','ido'])
function file(){
  try{return JSON.parse(fs.readFileSync(path.join(process.cwd(),'shops.json'),'utf8'))}catch{return {}}
}
function bag(){
  const mem=globalThis.__shops||(globalThis.__shops={})
  const disk=file()
  for(const k of Object.keys(disk)) if(!mem[k]||LOCK.has(k)) mem[k]=disk[k]
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
    if(!slug||LOCK.has(slug)){res.status(400).send('{"ok":false}');return}
    const shop={name:b.name||slug,phone:b.phone||'',place:b.place||'',hours:b.hours||'',rest:b.rest||'',treatments:Array.isArray(b.treatments)?b.treatments:[]}
    mem[slug]=shop
    try{
      const disk=file()
      disk[slug]=shop
      for(const k of LOCK){const keep=file()[k]; if(keep) disk[k]=keep}
      const frozen=file()
      if(frozen.haru) disk.haru=frozen.haru
      if(frozen.rinon) disk.rinon=frozen.rinon
      fs.writeFileSync(path.join(process.cwd(),'shops.json'),JSON.stringify(disk))
    }catch{}
    res.status(200).send(JSON.stringify({slug,...shop}))
    return
  }
  const u=new URL(req.url,'http://x')
  const slug=u.searchParams.get('slug')||''
  const disk=file()
  let shop=LOCK.has(slug)&&(disk[slug]||mem[slug]) || mem[slug] || disk[slug]
  if(shop) mem[slug]=shop
  if(!shop){res.status(404).send('{"ok":false}');return}
  res.status(200).send(JSON.stringify({slug,...shop}))
}
