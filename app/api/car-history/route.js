import { NextResponse } from "next/server";

const LANGS = new Set(["pt","de","fr","it","en","es"]);
function clean(v="",max=80){return String(v).trim().slice(0,max).replace(/[<>]/g,"");}
async function wdSearch(q,lang){
 const p=new URLSearchParams({action:"wbsearchentities",search:q,language:lang,uselang:lang,format:"json",origin:"*",limit:"30",type:"item"});
 const r=await fetch("https://www.wikidata.org/w/api.php?"+p,{headers:{"User-Agent":"TotalCarsSwitzerland/2.0 (info@totalcars.ch)"},next:{revalidate:86400}});
 if(!r.ok) throw Error("Wikidata search "+r.status);
 return (await r.json()).search||[];
}
async function entities(ids,lang){
 if(!ids.length)return {};
 const p=new URLSearchParams({action:"wbgetentities",ids:ids.join("|"),props:"labels|descriptions|claims|sitelinks",languages:lang+"|en|de|pt",format:"json",origin:"*"});
 const r=await fetch("https://www.wikidata.org/w/api.php?"+p,{headers:{"User-Agent":"TotalCarsSwitzerland/2.0 (info@totalcars.ch)"},next:{revalidate:86400}});
 if(!r.ok) throw Error("Wikidata entities "+r.status);
 return (await r.json()).entities||{};
}
function claimId(e,p){return e?.claims?.[p]?.[0]?.mainsnak?.datavalue?.value?.id||""}
function claimIds(e,p){return (e?.claims?.[p]||[]).map(x=>x?.mainsnak?.datavalue?.value?.id).filter(Boolean)}
function claimText(e,p){const v=e?.claims?.[p]?.[0]?.mainsnak?.datavalue?.value;return typeof v==="string"?v:""}
function claimYear(e,p){const t=e?.claims?.[p]?.[0]?.mainsnak?.datavalue?.value?.time;const m=t?.match(/[+-](\d{4})-/);return m?m[1]:""}
function commonsUrl(name){if(!name)return"";return "https://commons.wikimedia.org/wiki/Special:Redirect/file/"+encodeURIComponent(name.replace(/ /g,"_"))}
function label(e,lang){return e?.labels?.[lang]?.value||e?.labels?.en?.value||e?.labels?.de?.value||e?.labels?.pt?.value||""}

export async function GET(request){
 const {searchParams}=new URL(request.url);
 const q=clean(searchParams.get("q")||"");
 const lang=LANGS.has(searchParams.get("lang"))?searchParams.get("lang"):"pt";
 if(q.length<2)return NextResponse.json({success:false,cars:[],error:"Digite pelo menos 2 caracteres."},{status:400});
 try{
  const found=await wdSearch(q,lang);
  const raw=await entities(found.map(x=>x.id),lang);
  const makerIds=[...new Set(Object.values(raw).flatMap(e=>claimIds(e,"P176")))].slice(0,30);
  const makers=await entities(makerIds,lang);
  const cars=found.map(hit=>{
    const e=raw[hit.id]; if(!e)return null;
    const desc=(e.descriptions?.[lang]?.value||e.descriptions?.en?.value||hit.description||"").toLowerCase();
    const types=claimIds(e,"P31");
    const image=claimText(e,"P18");
    const manufacturer=claimId(e,"P176");
    const automotive=/car|automobile|vehicle|motor|voiture|automóvil|automóvel|auto|fahrzeug|wagen|coupé|sedan|suv|roadster|hatchback|pickup|van/.test(desc) || !!manufacturer || !!image;
    if(!automotive)return null;
    return {
      id:hit.id,name:label(e,lang)||hit.label,description:e.descriptions?.[lang]?.value||e.descriptions?.en?.value||hit.description||"",
      manufacturer:manufacturer?label(makers[manufacturer],lang):"",
      imageUrl:commonsUrl(image),
      startYear:claimYear(e,"P571")||claimYear(e,"P577"),
      endYear:claimYear(e,"P576"),
      types,
      wikidata:"https://www.wikidata.org/wiki/"+hit.id
    };
  }).filter(Boolean);
  return NextResponse.json({success:true,query:q,count:cars.length,cars,source:"Wikidata/Wikimedia"});
 }catch(e){console.error("world-cars",e);return NextResponse.json({success:false,cars:[],error:"Não foi possível consultar o catálogo mundial agora."},{status:502})}
}