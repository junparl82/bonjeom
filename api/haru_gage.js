import p0 from '../lib/h_gage_0.js'
import p1 from '../lib/h_gage_1.js'
import p2 from '../lib/h_gage_2.js'
import p3 from '../lib/h_gage_3.js'
export default function handler(req,res){const b=Buffer.from(p0+p1+p2+p3,'base64');res.setHeader('Content-Type','image/jpeg');res.setHeader('Cache-Control','public,max-age=60');res.status(200).send(b)}
