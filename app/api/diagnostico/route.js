export const runtime="nodejs";
const MAX_TEXT=4000;
function fallback(vehicle,text){
 const car=[vehicle?.brand,vehicle?.model,vehicle?.year,vehicle?.engine].filter(Boolean).join(" ");
 return `A inteligência do diagnóstico está temporariamente indisponível.\n\nVeículo: ${car||"não informado"}\nSintoma registrado: ${text.slice(0,700)}\n\nSe houver perda de freio ou direção, superaquecimento, fumaça intensa, cheiro forte de combustível, luz vermelha de óleo ou risco elétrico, não continue dirigindo. Caso contrário, anote se acontece frio/quente, na partida, em movimento e de qual lado vem o ruído, e tente novamente.`;
}
export async function POST(request){
 try{
  const body=await request.json();
  const vehicle=body?.vehicle||{};
  const messages=Array.isArray(body?.messages)?body.messages.slice(-20):[];
  const last=[...messages].reverse().find(m=>m?.role==="user"&&typeof m.text==="string");
  const text=last?.text?.trim()||"";
  if(!text)return Response.json({error:"Descreva um sintoma para iniciar."},{status:400});
  if(text.length>MAX_TEXT)return Response.json({error:"A descrição é muito longa (máximo de 4.000 caracteres)."},{status:413});
  const total=messages.reduce((n,m)=>n+(typeof m?.text==="string"?m.text.length:0),0);
  if(total>30000)return Response.json({error:"O histórico ficou muito grande. Inicie um novo diagnóstico."},{status:413});
  const key=process.env.GEMINI_API_KEY;
  if(!key)return Response.json({text:fallback(vehicle,text),fallback:true});
  const car=[vehicle.brand,vehicle.model,vehicle.year,vehicle.engine,vehicle.fuel,vehicle.km&&vehicle.km+" km",vehicle.gearbox].filter(Boolean).join(" | ");
  const history=messages.filter(m=>m&&typeof m.text==="string"&&m.text.length<=MAX_TEXT).map(m=>({role:m.role==="user"?"user":"model",parts:[{text:m.text}]}));
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),18000);
  try{
   const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":key},signal:controller.signal,body:JSON.stringify({systemInstruction:{parts:[{text:`Você é Total Cars AI, especialista em triagem automotiva. Veículo atual: ${car||"não informado"}. Responda no idioma do usuário. Mantenha todo o contexto e não repita perguntas respondidas. Faça no máximo 1 ou 2 perguntas objetivas quando faltarem dados decisivos. Quando houver informação suficiente, organize: CAUSAS POSSÍVEIS; VERIFIQUE PRIMEIRO; SEGURANÇA/URGÊNCIA; PRÓXIMO TESTE. Diferencie hipótese de confirmação. Nunca invente códigos OBD, peças, recalls, torques, pressões, preços ou especificações. Para freios, direção, superaquecimento, combustível, óleo, fumaça e alta tensão, seja conservador e diga claramente quando não dirigir.`}]},contents:history,generationConfig:{maxOutputTokens:1100,temperature:.25}})});
   const data=await response.json();
   if(!response.ok)return Response.json({error:response.status===429?"O limite da IA foi atingido. Tente novamente mais tarde.":"A IA está temporariamente indisponível. Tente novamente."},{status:response.status===429?429:502});
   const out=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n").trim();
   if(!out)return Response.json({error:"A IA respondeu sem texto."},{status:502});
   return Response.json({text:out});
  }finally{clearTimeout(timer)}
 }catch(e){console.error("diagnostico",e?.name||"error");return Response.json({error:"Erro interno no diagnóstico. Tente novamente."},{status:500})}
}