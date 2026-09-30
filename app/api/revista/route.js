export const runtime="nodejs";
const feeds=[
 "https://www.autocar.co.uk/rss",
 "https://www.topgear.com/rss"
];
async function fetchWithTimeout(url,options={},ms=12000){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),ms);try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timer)}}
function strip(s=""){return s.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/\s+/g," ").trim()}
function items(xml){return [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].slice(0,8).map(m=>{const x=m[0];const get=t=>strip((x.match(new RegExp("<"+t+"[^>]*>([\\s\\S]*?)<\\/"+t+">","i"))||[])[1]||"");return {title:get("title"),link:get("link"),description:get("description"),date:get("pubDate")}}).filter(x=>x.title&&x.link)}
export async function GET(){
 try{
  const key=process.env.GEMINI_API_KEY;
  if(!key)return Response.json({error:"GEMINI_API_KEY ausente"},{status:500});
  const batches=await Promise.allSettled(feeds.map(async u=>{const r=await fetchWithTimeout(u,{next:{revalidate:1800}},12000);if(!r.ok)throw 0;return items(await r.text())}));
  const source=batches.flatMap(x=>x.status==="fulfilled"?x.value:[]).slice(0,10);
  if(!source.length)return Response.json({error:"Nenhuma fonte disponível agora"},{status:502});
  const prompt=`Crie uma edição curta da Revista Total Cars usando SOMENTE os fatos fornecidos abaixo. Não invente especificações, datas ou declarações. Escreva em português brasileiro, texto original, sem copiar frases das fontes. Retorne JSON puro como array de até 6 objetos com: title, sub, body (60-110 palavras), category, sourceUrl. Preserve exatamente uma sourceUrl fornecida em cada matéria. Fontes:\n${source.map((x,i)=>i+" | "+x.title+" | "+x.description+" | "+x.link).join("\n")}`;
  const r=await fetchWithTimeout("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:.2,maxOutputTokens:2400,responseMimeType:"application/json"}})},20000);
  const d=await r.json();if(!r.ok)return Response.json({error:"Falha ao montar revista"},{status:502});
  const raw=d?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"[]";
  let articles=JSON.parse(raw);if(!Array.isArray(articles))articles=articles.articles||[];
  return Response.json({articles,updatedAt:new Date().toISOString()},{headers:{"Cache-Control":"s-maxage=1800, stale-while-revalidate=3600"}});
 }catch(e){console.error("revista",e);return Response.json({error:"Erro ao atualizar revista"},{status:500})}
}