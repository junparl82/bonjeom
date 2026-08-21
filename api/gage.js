import p0 from '../lib/r_gage_0.js'
import p1 from '../lib/r_gage_1.js'
import p2 from '../lib/r_gage_2.js'
import p3 from '../lib/r_gage_3.js'
import p4 from '../lib/r_gage_4.js'
import p5 from '../lib/r_gage_5.js'
import p6 from '../lib/r_gage_6.js'
export default function handler(req,res){const b=Buffer.from(p0+p1+p2+p3+p4+p5+p6,'base64');res.setHeader('Content-Type','image/jpeg');res.setHeader('Cache-Control','public,max-age=60');res.status(200).send(b)}
