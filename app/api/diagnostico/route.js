export const runtime = "nodejs";
export async function POST(request) {
 try {
  const {messages=[]}=await request.json();
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey) return Response.json({error:"A chave OPENAI_API_KEY não está disponível no servidor. Faça um novo deploy após salvar a variável na Vercel."},{status:500});
  const input=messages.slice(-20).filter(m=>m&&typeof m.text==="string").map(m=>({role:m.role==="user"?"user":"assistant",content:[{type:m.role==="user"?"input_text":"output_text",text:m.text}]}));
  if(!input.length)return Response.json({error:"Escreva uma mensagem para iniciar."},{status:400});
  const instructions="Você é Total Cars AI, especialista automotivo do totalcars.ch. Responda no idioma do usuário. Mantenha o contexto e nunca pergunte novamente dados já informados. Faça diagnóstico remoto como triagem, indicando causas prováveis, verificações em ordem e alertas de segurança. Não invente códigos, peças, preços ou certezas.";
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},body:JSON.stringify({model:"gpt-5-mini",instructions,input,max_output_tokens:900})});
  const d=await r.json();
  if(!r.ok){console.error("OpenAI",r.status,d?.error?.type,d?.error?.code);const msg=r.status===401?"A chave da OpenAI foi recusada.":r.status===429?"A conta da API está sem créditos ou atingiu o limite de uso.":"A OpenAI retornou erro "+r.status+".";return Response.json({error:msg},{status:r.status===429?429:502})}
  const out=d.output_text||d.output?.flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n");
  if(!out)return Response.json({error:"A IA respondeu sem texto."},{status:502});
  return Response.json({text:out});
 }catch(e){console.error("diagnostico",e);return Response.json({error:"Erro interno no diagnóstico."},{status:500})}
}