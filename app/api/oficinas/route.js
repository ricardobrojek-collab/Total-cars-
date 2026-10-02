export const runtime="nodejs";
const headers={"User-Agent":"TotalCarsCH/1.0 (totalcars.ch)","Accept":"application/json"};
function dist(a,b,c,d){const R=6371,p=Math.PI/180;const x=(c-a)*p,y=(d-b)*p;const h=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
export async function GET(req){
 try{
  const q=(new URL(req.url).searchParams.get("plz")||"").trim();
  if(!q) return Response.json({garages:[]});
  const geo=await fetch("https://nominatim.openstreetmap.org/search?format=json&countrycodes=ch&limit=1&postalcode="+encodeURIComponent(q),{headers,next:{revalidate:86400}});
  const g=await geo.json(); if(!g?.[0]) return Response.json({garages:[],error:"CEP/PLZ não encontrado."},{status:404});
  const lat=Number(g[0].lat),lon=Number(g[0].lon),radius=15000;
  const query=`[out:json][timeout:20];(nwr["shop"="car_repair"](around:${radius},${lat},${lon});nwr["craft"="car_repair"](around:${radius},${lat},${lon});nwr["shop"="tyres"](around:${radius},${lat},${lon}););out center tags;`;
  const r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"TotalCarsCH/1.0 (totalcars.ch)"},body:"data="+encodeURIComponent(query),cache:"no-store"});
  if(!r.ok) throw Error("overpass");
  const d=await r.json();
  const garages=(d.elements||[]).map(x=>{const t=x.tags||{},la=x.lat??x.center?.lat,lo=x.lon??x.center?.lon;return {id:x.type+"-"+x.id,name:t.name||t.operator||"Oficina automotiva",lat:la,lon:lo,distance:la&&lo?dist(lat,lon,la,lo):null,address:[t["addr:street"],t["addr:housenumber"],t["addr:postcode"],t["addr:city"]].filter(Boolean).join(" "),phone:t.phone||t["contact:phone"]||"",email:t.email||t["contact:email"]||"",website:t.website||t["contact:website"]||""}}).filter(x=>x.name).sort((a,b)=>(a.distance??99)-(b.distance??99)).slice(0,60);
  return Response.json({center:{lat,lon},garages},{headers:{"Cache-Control":"s-maxage=3600, stale-while-revalidate=86400"}});
 }catch(e){console.error("oficinas",e);return Response.json({garages:[],error:"Não foi possível consultar as oficinas agora."},{status:502})}
}