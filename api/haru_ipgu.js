import p0 from '../lib/h_ipgu_0.js'
import p1 from '../lib/h_ipgu_1.js'
import p2 from '../lib/h_ipgu_2.js'
export default function handler(req,res){const b=Buffer.from(p0+p1+p2,'base64');res.setHeader('Content-Type','image/jpeg');res.setHeader('Cache-Control','public,max-age=60');res.status(200).send(b)}
