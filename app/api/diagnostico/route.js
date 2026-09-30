export const runtime = "nodejs";
export async function POST(request) {
 try {
  const {messages=[]}=await request.json();
  if(!Array.isArray(messages)||messages.length>50)return Response.json({error:"Conversa inválida ou muito longa."},{status:400});
  const totalChars=messages.reduce((n,m)=>n+(typeof m?.text==="string"?m.text.length:0),0);
  if(totalChars>30000)return Response.json({error:"Conversa muito grande. Inicie uma nova conversa."},{status:413});
  const apiKey=process.env.GEMINI_API_KEY;
  if(!apiKey) return Response.json({error:"GEMINI_API_KEY não está disponível no servidor. Faça um novo deploy após salvar a variável na Vercel."},{status:500});
  const history=messages.slice(-20).filter(m=>m&&typeof m.text==="string").map(m=>({role:m.role==="user"?"user":"model",parts:[{text:m.text}]}));
  if(!history.length)return Response.json({error:"Escreva uma mensagem para iniciar."},{status:400});
  const systemInstruction={parts:[{text:"Você é Total Cars AI, especialista automotivo do totalcars.ch. Responda no idioma do usuário. Mantenha o contexto e nunca pergunte novamente dados já informados. Faça diagnóstico remoto como triagem, indicando causas prováveis, verificações em ordem e alertas de segurança. Não invente códigos, peças, preços ou certezas. Faça no máximo 1 ou 2 perguntas objetivas quando realmente necessário."}]};
  const url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  let r;
  try{r=await fetch(url,{method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify({systemInstruction,contents:history,generationConfig:{maxOutputTokens:900,temperature:0.35}})});}finally{clearTimeout(timer)}
  const d=await r.json();
  if(!r.ok){console.error("Gemini",r.status,d?.error?.status,d?.error?.message);let msg="A IA retornou erro "+r.status+".";if(r.status===401||r.status===403)msg="A chave do Gemini foi recusada ou não tem permissão.";if(r.status===429)msg="O limite gratuito do Gemini foi atingido. Tente novamente mais tarde.";return Response.json({error:msg},{status:r.status===429?429:502})}
  const out=d?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n").trim();
  if(!out)return Response.json({error:"A IA respondeu sem texto."},{status:502});
  return Response.json({text:out});
 }catch(e){console.error("diagnostico",e);return Response.json({error:"Erro interno no diagnóstico."},{status:500})}
}