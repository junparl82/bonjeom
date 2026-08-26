import fs from 'fs'
import path from 'path'
const LOCK=new Set(['rinon','haru','_t','ido'])
const FOUR=['커트 문의','염색 문의','펌 문의','상담 문의']
const PACK={
  rinon:{name:"리논",phone:"0507-1420-8831",place:"성수",hours:"화–일 11:00–20:00",rest:"월 휴무",treatments:["커트 45,000","염색 문의","펌 130,000","상담 문의"]},
  haru:{name:"하루",phone:"0507-1834-2201",place:"연남",hours:"화–일 11:00–20:00",rest:"월 휴무",treatments:["커트 38,000","염색 90,000","펌 110,000","클리닉 70,000"]}
}
const RAW='https://raw.githubusercontent.com/junparl82/bonjeom/main/shops.json'
function file(){
  try{return JSON.parse(fs.readFileSync(path.join(process.cwd(),'shops.json'),'utf8'))}catch{return {}}
}
async function remote(){
  try{
    const r=await fetch(RAW,{cache:'no-store'})
    if(!r.ok) return {}
    const j=await r.json()
    return j&&typeof j==='object'?j:{}
  }catch{return {}}
}
function bag(){
  const mem=globalThis.__shops||(globalThis.__shops={})
  const disk=file()
  for(const k of Object.keys(disk)) if(!mem[k]||LOCK.has(k)) mem[k]=disk[k]
  return mem
}
function comma(n){
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')
}
function priced(s){
  const t=String(s||'').trim()
  if(!t) return ''
  const bits=t.split(/\s+/)
  const name=bits[0]
  const rest=bits.slice(1).join('')
  if(!name||name==='문의') return ''
  if(!rest||rest==='문의') return name+' 문의'
  const digits=rest.replace(/[^\d]/g,'')
  if(!digits) return name+' 문의'
  return name+' '+comma(digits)
}
function named(list){
  const out=(Array.isArray(list)?list:[]).map(priced).filter(Boolean)
  return out.length?out:FOUR
}
function read(req){return new Promise(r=>{let s='';req.on('data',d=>s+=d);req.on('end',()=>r(s))})}
export default async function handler(req,res){
  const mem=bag()
  res.setHeader('Content-Type','application/json;charset=utf-8')
  res.setHeader('Cache-Control','no-store')
  if(req.method==='POST'){
    let b={};try{b=JSON.parse(await read(req)||'{}')}catch{b={}}
    const slug=String(b.slug||'').replace(/[^a-z0-9가-힣-]/gi,'').slice(0,32)
    if(PACK[slug]){
      res.status(200).send(JSON.stringify({slug,...PACK[slug]}))
      return
    }
    if(!slug||LOCK.has(slug)){res.status(400).send('{"ok":false}');return}
    const shop={name:b.name||slug,phone:b.phone||'',place:b.place||'',hours:b.hours||'',rest:b.rest||'',treatments:named(b.treatments)}
    mem[slug]=shop
    try{
      const disk=file()
      disk[slug]=shop
      for(const k of LOCK){const keep=file()[k]; if(keep) disk[k]=keep}
      const frozen=file()
      if(frozen.haru) disk.haru=frozen.haru
      if(frozen.rinon) disk.rinon=frozen.rinon
      if(frozen.shopjsp01d && slug!=='shopjsp01d') disk.shopjsp01d=frozen.shopjsp01d
      delete disk.shop12ju71
      delete disk.shoppm6plx
      fs.writeFileSync(path.join(process.cwd(),'shops.json'),JSON.stringify(disk))
    }catch{}
    res.status(200).send(JSON.stringify({slug,...shop}))
    return
  }
  const u=new URL(req.url,'http://x')
  const slug=u.searchParams.get('slug')||''
  const disk=file()
  const rem=LOCK.has(slug)?{}:await remote()
  let shop=LOCK.has(slug)&&(disk[slug]||mem[slug]) || mem[slug] || disk[slug] || rem[slug]
  if(shop) mem[slug]=shop
  if(!shop){res.status(404).send('{"ok":false}');return}
  if(!PACK[slug]) shop={...shop,treatments:named(shop.treatments)}
  res.status(200).send(JSON.stringify({slug,...shop}))
}
