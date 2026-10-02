import {NextResponse} from "next/server";
const clean=(v="",n=80)=>String(v).trim().slice(0,n).replace(/[<>"']/g,"");
async function findBrand(name){
 const p=new URLSearchParams({action:"wbsearchentities",search:name,language:"en",format:"json",origin:"*",limit:"10",type:"item"});
 const r=await fetch("https://www.wikidata.org/w/api.php?"+p,{headers:{"User-Agent":"TotalCarsSwitzerland/4.0 (info@totalcars.ch)"},next:{revalidate:604800}});
 if(!r.ok)throw Error("brand search "+r.status);
 const a=(await r.json()).search||[];
 return a.find(x=>/automotive|automobile|car|vehicle|manufacturer|marque/i.test(x.description||""))||a[0];
}
async function sparql(q){
 const url="https://query.wikidata.org/sparql?query="+encodeURIComponent(q)+"&format=json";
 const r=await fetch(url,{headers:{"User-Agent":"TotalCarsSwitzerland/4.0 (info@totalcars.ch)","Accept":"application/sparql-results+json"},next:{revalidate:86400}});
 if(!r.ok)throw Error("WDQS "+r.status);
 return (await r.json()).results?.bindings||[];
}
const val=(x,k)=>x?.[k]?.value||"";
export async function GET(req){
 const u=new URL(req.url),brand=clean(u.searchParams.get("brand")||""),model=clean(u.searchParams.get("model")||"");
 if(!brand)return NextResponse.json({success:false,error:"Escolha uma marca."},{status:400});
 try{
  const b=await findBrand(brand); if(!b?.id)throw Error("Marca não identificada");
  const modelFilter=model?`FILTER(CONTAINS(LCASE(STR(?carLabel)), LCASE("${model}")))`:"";
  const q=`SELECT DISTINCT ?car ?carLabel ?image ?start ?end WHERE {
    ?car wdt:P176 wd:${b.id}.
    OPTIONAL { ?car wdt:P18 ?image. }
    OPTIONAL { ?car wdt:P571 ?start. }
    OPTIONAL { ?car wdt:P576 ?end. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en,de". }
    ${modelFilter}
  } LIMIT 250`;
  const rows=await sparql(q);
  const seen=new Set();
  const items=rows.map(x=>{
    const uri=val(x,"car"),id=uri.split("/").pop(),name=val(x,"carLabel");
    if(!id||!name||seen.has(id))return null;seen.add(id);
    const sy=(val(x,"start").match(/(\\d{4})-/)||[])[1]||"";
    const ey=(val(x,"end").match(/(\\d{4})-/)||[])[1]||"";
    return{id,name,manufacturer:brand,imageUrl:val(x,"image").replace("http://","https://"),startYear:sy,endYear:ey,wikidata:uri};
  }).filter(Boolean).sort((a,b)=>(a.startYear||"9999").localeCompare(b.startYear||"9999")||a.name.localeCompare(b.name));
  return NextResponse.json({success:true,brand,brandId:b.id,brandDescription:b.description||"",model,count:items.length,items});
 }catch(e){console.error("car history",e);return NextResponse.json({success:false,error:"Não foi possível montar a história desta marca agora.",items:[]},{status:502})}
}