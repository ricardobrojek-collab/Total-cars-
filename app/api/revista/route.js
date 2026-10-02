import { buildMagazine } from "../../../lib/revista";

export const runtime = "nodejs";

const languageNames={pt:"Português brasileiro",de:"Deutsch",fr:"Français",it:"Italiano",en:"English",es:"Español"};

async function translateArticles(articles,lang){
  if(lang==="en"||!articles?.length) return articles;
  const key=process.env.GEMINI_API_KEY;
  if(!key) return articles;
  const payload=articles.slice(0,12).map((a,i)=>({id:i,title:a.title,sub:a.sub||a.description||""}));
  const prompt=`Translate the automotive magazine items below into ${languageNames[lang]||languageNames.pt}. Translate title and sub naturally and accurately. Keep brand/model names unchanged. Do not add facts. Return ONLY a JSON array with objects: id,title,sub. ITEMS: ${JSON.stringify(payload)}`;
  try{
    const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:.15,maxOutputTokens:3500,responseMimeType:"application/json"}})});
    if(!response.ok) return articles;
    const data=await response.json();
    const raw=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"[]";
    const translated=JSON.parse(raw);
    const map=new Map((Array.isArray(translated)?translated:[]).map(x=>[Number(x.id),x]));
    return articles.map((a,i)=>{const t=map.get(i);return t?{...a,title:t.title||a.title,sub:t.sub||a.sub||a.description}:a});
  }catch(e){console.error("revista translate",e);return articles}
}

export async function GET(request) {
  try {
    const lang=new URL(request.url).searchParams.get("lang")||"pt";
    const data=await buildMagazine();
    const articles=await translateArticles(data.articles,lang);
    return Response.json({...data,articles}, {headers:{"Cache-Control":"s-maxage=1800, stale-while-revalidate=7200"}});
  } catch (error) {
    console.error("revista api", error);
    return Response.json({articles:[],error:"Não foi possível atualizar a revista agora."},{status:500});
  }
}
