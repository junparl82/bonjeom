const slug=decodeURIComponent((location.pathname.split('/').filter(Boolean)[1]||''))
function swipe(left,right){
  let x=0
  addEventListener('touchstart',e=>x=e.changedTouches[0].clientX,{passive:true})
  addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x;if(d<-48&&left)location.href=left;if(d>48&&right)location.href=right},{passive:true})
}
async function fill(fn){
  let s=null
  try{const r=await fetch('/api/shop?slug='+encodeURIComponent(slug));if(r.ok)s=await r.json()}catch{}
  if(!s){try{const all=await (await fetch('/shops.json')).json();s=all[slug]||null}catch{}}
  if(!s){try{s=JSON.parse(localStorage.getItem('shop:'+slug)||'null')}catch{}}
  if(!s){s={name:slug,place:'',hours:'',rest:'',phone:'',treatments:[]}}
  fn(s)
}
