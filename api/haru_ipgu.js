import p0 from '../lib/h_ipgu_0.js'
import p1 from '../lib/h_ipgu_1.js'
import p2 from '../lib/h_ipgu_2.js'
import p3 from '../lib/h_ipgu_3.js'
import p4 from '../lib/h_ipgu_4.js'
import p5 from '../lib/h_ipgu_5.js'
import p6 from '../lib/h_ipgu_6.js'
import p7 from '../lib/h_ipgu_7.js'
export default function handler(req,res){const b=Buffer.from(p0+p1+p2+p3+p4+p5+p6+p7,'base64');res.setHeader('Content-Type','image/jpeg');res.setHeader('Cache-Control','public,max-age=60');res.status(200).send(b)}
