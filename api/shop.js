const mem=globalThis.__shops||(globalThis.__shops={})
function read(req){return new Promise(r=>{let s='';req.on('data',d=>s+=d);req.on('end',()=>r(s))})}
export default async function handler(req,res){
  res.setHeader('Content-Type','application/json;charset=utf-8')
  res.setHeader('Cache-Control','no-store')
  if(req.method==='POST'){
    let b={};try{b=JSON.parse(await read(req)||'{}')}catch{b={}}
    const slug=String(b.slug||'').replace(/[^a-z0-9가-힣-]/gi,'').slice(0,32)
    if(!slug||slug==='rinon'||slug==='_t'){res.status(400).send('{"ok":false}');return}
    const shop={name:b.name||slug,phone:b.phone||'',place:b.place||'',hours:b.hours||'',rest:b.rest||'',treatments:Array.isArray(b.treatments)?b.treatments:[]}
    mem[slug]=shop
    res.status(200).send(JSON.stringify({slug,...shop}))
    return
  }
  const u=new URL(req.url,'http://x')
  const slug=u.searchParams.get('slug')||''
  const shop=mem[slug]
  if(!shop){res.status(404).send('{"ok":false}');return}
  res.status(200).send(JSON.stringify({slug,...shop}))
}
