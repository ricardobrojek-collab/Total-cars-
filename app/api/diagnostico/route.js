export const runtime = "nodejs";

function cleanJson(text="") {
  try { return JSON.parse(text); } catch {}
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

function stripDataUrl(data="") {
  const i = data.indexOf(",");
  return i >= 0 ? data.slice(i + 1) : data;
}

function isoSeconds(v="") {
  const m = v.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (+m[1]||0)*3600 + (+m[2]||0)*60 + (+m[3]||0);
}

function tokens(q="") {
  const stop = new Set(["the","and","for","with","from","how","to","a","an","of","on","in","repair","replacement","fix","diagnosis","car","vehicle"]);
  return q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/[^a-z0-9]+/).filter(x=>x.length>2&&!stop.has(x));
}

async function searchYouTube(query) {
  const key = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key || !query) return [];
  try {
    const p = new URLSearchParams({
      part:"snippet",
      type:"video",
      maxResults:"8",
      q:query,
      order:"relevance",
      safeSearch:"moderate",
      videoEmbeddable:"true",
      videoSyndicated:"true",
      regionCode:"CH",
      key
    });
    const r = await fetch("https://www.googleapis.com/youtube/v3/search?"+p.toString(), {cache:"no-store"});
    const d = await r.json();
    if (!r.ok || !Array.isArray(d.items)) {
      console.warn("YouTube search unavailable", r.status, d?.error?.message || "");
      return [];
    }
    const ids = d.items.map(x=>x?.id?.videoId).filter(Boolean);
    if (!ids.length) return [];
    const p2 = new URLSearchParams({part:"snippet,contentDetails,statistics",id:ids.join(","),key});
    const r2 = await fetch("https://www.googleapis.com/youtube/v3/videos?"+p2.toString(), {cache:"no-store"});
    const d2 = await r2.json();
    const wanted = new Set(tokens(query));
    const list = (d2.items||[]).map(v=>{
      const title = v?.snippet?.title || "";
      const desc = v?.snippet?.description || "";
      const hay = (title+" "+desc).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
      let hit=0;
      for (const t of wanted) if (hay.includes(t)) hit++;
      const views = Number(v?.statistics?.viewCount||0);
      const secs = isoSeconds(v?.contentDetails?.duration||"");
      const usefulDuration = secs>=90 && secs<=3600 ? 3 : 0;
      const score = hit*12 + Math.min(12, Math.log10(views+1)*2) + usefulDuration;
      return {
        id:v.id,
        title,
        channel:v?.snippet?.channelTitle||"",
        thumbnail:v?.snippet?.thumbnails?.medium?.url || v?.snippet?.thumbnails?.default?.url || "",
        publishedAt:v?.snippet?.publishedAt||"",
        durationSeconds:secs,
        views,
        score
      };
    }).sort((a,b)=>b.score-a.score);
    return list.slice(0,5);
  } catch (e) {
    console.warn("YouTube search error", e?.message);
    return [];
  }
}

export async function POST(request) {
  try {
    const {messages=[],vehicle={},media=null}=await request.json();
    const apiKey=process.env.GEMINI_API_KEY;
    if(!apiKey) return Response.json({error:"GEMINI_API_KEY não está disponível no servidor. Faça um novo deploy após salvar a variável na Vercel."},{status:500});

    const vehicleText = [
      vehicle.brand, vehicle.model, vehicle.version, vehicle.year, vehicle.motor,
      vehicle.vin ? "VIN "+vehicle.vin : ""
    ].filter(Boolean).join(" | ");

    const history=messages.slice(-16).filter(m=>m&&typeof m.text==="string").map(m=>({
      role:m.role==="user"?"user":"model",
      parts:[{text:m.text}]
    }));
    if(!history.length && !media) return Response.json({error:"Escreva uma mensagem para iniciar."},{status:400});

    if (media?.data && media?.mimeType) {
      const lastUser = [...history].reverse().find(x=>x.role==="user");
      const part={inlineData:{mimeType:media.mimeType,data:stripDataUrl(media.data)}};
      if (lastUser) lastUser.parts.push(part);
      else history.push({role:"user",parts:[{text:"Analise esta mídia do veículo."},part]});
    }

    const systemInstruction={parts:[{text:`Você é Total Cars AI, um assistente de triagem e reparação automotiva para a Suíça e Europa.
Veículo atual: ${vehicleText || "não informado"}.

OBJETIVO:
Entender o sintoma em linguagem comum, transformar em hipóteses técnicas, ensinar verificações do mais simples/seguro ao mais específico e criar UMA consulta de vídeo extremamente precisa para localizar um tutorial compatível com o veículo.

REGRAS:
- Responda no idioma do usuário.
- Nunca invente torque, código, peça, preço, especificação OEM ou certeza diagnóstica.
- Diferencie hipótese de defeito confirmado.
- Se faltarem dados, ainda entregue a melhor triagem possível e faça no máximo uma pergunta final.
- Para freios, direção, airbag, combustível sob pressão, alta tensão de híbrido/EV, veículo suspenso ou mola sob tensão, priorize segurança e limite instruções perigosas.
- Ao analisar áudio, descreva o tipo de ruído e possíveis fontes, sem afirmar diagnóstico certo só pelo som.
- Ao analisar foto, diga o que é visível e o que não pode ser confirmado.
- video_query deve ser em inglês e conter marca/modelo/geração/motor quando relevante + componente + procedimento/sintoma. É uma busca, não um título inventado.
- search_terms deve ter também variações úteis em alemão, inglês e português.
- confidence só pode ser "alta", "média" ou "baixa" e significa compatibilidade com os sintomas, não probabilidade estatística.

RETORNE SOMENTE JSON válido neste formato:
{
  "summary":"resumo objetivo",
  "urgency":"baixa|média|alta|crítica",
  "warning":"alerta de segurança ou string vazia",
  "likely_causes":[{"title":"causa","confidence":"alta|média|baixa","why":"por que combina","check":"como confirmar com segurança"}],
  "checks":["teste 1","teste 2"],
  "repair":{"difficulty":"fácil|médio|difícil|profissional","tools":["ferramenta"],"parts":["peça possível"],"steps":["passo seguro"]},
  "video_query":"consulta principal em inglês",
  "search_terms":["consulta DE","consulta EN","consulta PT"],
  "follow_up_question":"uma pergunta opcional ou string vazia"
}`}]};

    const url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const r=await fetch(url,{
      method:"POST",
      headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},
      body:JSON.stringify({
        systemInstruction,
        contents:history,
        generationConfig:{maxOutputTokens:1800,temperature:0.2,responseMimeType:"application/json"}
      })
    });
    const d=await r.json();
    if(!r.ok){
      console.error("Gemini",r.status,d?.error?.status,d?.error?.message);
      let msg="A IA retornou erro "+r.status+".";
      if(r.status===401||r.status===403)msg="A chave do Gemini foi recusada ou não tem permissão.";
      if(r.status===429)msg="O limite do Gemini foi atingido. Tente novamente mais tarde.";
      return Response.json({error:msg},{status:r.status===429?429:502});
    }
    const raw=d?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n").trim();
    const analysis=cleanJson(raw);
    if(!analysis) return Response.json({error:"A IA respondeu, mas o diagnóstico veio em formato inválido."},{status:502});

    const query = String(analysis.video_query||"").trim();
    const videos = await searchYouTube(query);
    const youtubeSearchUrl = query ? "https://www.youtube.com/results?search_query="+encodeURIComponent(query) : "";

    return Response.json({analysis,videos,youtubeSearchUrl,videoSearchReady:videos.length>0});
  }catch(e){
    console.error("diagnostico",e);
    return Response.json({error:"Erro interno no diagnóstico."},{status:500});
  }
}
