export const runtime="nodejs";
const WINDOW=60*60*24;
function idFrom(req){
 const raw=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||req.headers.get("x-real-ip")||"";
 const ua=req.headers.get("user-agent")||"";
 let h=2166136261;for(const ch of raw+"|"+ua){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(36)
}
export async function POST(req){
 // Persistent counter requires Vercel KV/Upstash REST credentials.
 const url=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
 const token=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
 if(!url||!token)return Response.json({count:0,configured:false});
 const id=idFrom(req), day=Math.floor(Date.now()/1000/WINDOW), seen=`tc:visitor:${day}:${id}`, total="tc:visitors:total";
 try{
  const headers={Authorization:`Bearer ${token}`};
  const exists=await fetch(`${url}/get/${encodeURIComponent(seen)}`,{headers,cache:"no-store"}).then(r=>r.json());
  if(exists?.result!==null)return Response.json({count:Number((await fetch(`${url}/get/${total}`,{headers,cache:"no-store"}).then(r=>r.json()))?.result||0)});
  await fetch(`${url}/set/${encodeURIComponent(seen)}/1/ex/86400`,{headers,cache:"no-store"});
  const inc=await fetch(`${url}/incr/${total}`,{headers,cache:"no-store"}).then(r=>r.json());
  return Response.json({count:Number(inc?.result||0)});
 }catch{return Response.json({count:0,configured:false})}
}