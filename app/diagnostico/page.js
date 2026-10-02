"use client";
import {useEffect,useRef,useState} from "react";
import ui from "./diagnostico.module.css";

const brands=["Audi","BMW","Mercedes-Benz","Volkswagen","Porsche","Skoda","SEAT / Cupra","Toyota","Lexus","Volvo","Ford","Opel","Renault","Peugeot","Citroën","Fiat","Alfa Romeo","Jeep","Land Rover","Jaguar","Nissan","Honda","Mazda","Subaru","Mitsubishi","Hyundai","Kia","Tesla","Polestar","Dacia","Suzuki","MINI","Smart","Ferrari","Lamborghini","Maserati","Outra"];
const audi={brand:"Audi",model:"A6",version:"C7",year:"2015",motor:"3.0 TDI V6 Quattro",vin:""};
const welcome={role:"ai",text:"Descreva o defeito do seu carro do seu jeito. Você também pode enviar uma foto ou gravar o barulho. Eu vou organizar as causas possíveis, testes seguros e procurar o vídeo de reparo mais compatível com o seu veículo."};

function Result({m}){
 const a=m.analysis;if(!a)return null;
 const u={baixa:ui.low,"média":ui.medium,alta:ui.high,"crítica":ui.critical}[a.urgency]||ui.medium;
 return <div className={ui.resultShell}>
  <span className={ui.aiBadge}>✦ TRIAGEM TOTAL CARS AI</span>
  <div className={ui.resultTop}><p>{a.summary}</p><span className={ui.urgency+" "+u}>{a.urgency||"triagem"}</span></div>
  {a.warning&&<div className={ui.warning}>⚠️ {a.warning}</div>}
  {!!a.likely_causes?.length&&<section className={ui.section}><h3>🔎 Causas mais compatíveis</h3><div className={ui.causeGrid}>{a.likely_causes.map((c,i)=><article className={ui.causeCard} key={i}><div className={ui.causeHead}><b>{i+1}. {c.title}</b><span className={ui.confidence}>{c.confidence}</span></div><p>{c.why}</p><span className={ui.check}><b>Como confirmar:</b> {c.check}</span></article>)}</div></section>}
  {!!a.checks?.length&&<section className={ui.section}><h3>🧪 Ordem de verificação</h3><ol className={ui.list}>{a.checks.map((x,i)=><li key={i}>{x}</li>)}</ol></section>}
  {a.repair&&<section className={ui.section}><h3>🛠️ Reparação</h3><div className={ui.repairMeta}><div className={ui.pillBox}><small>Dificuldade</small><b>{a.repair.difficulty||"—"}</b></div><div className={ui.pillBox}><small>Peças possíveis</small><div className={ui.tagWrap}>{(a.repair.parts||[]).map((x,i)=><span className={ui.tag} key={i}>{x}</span>)}</div></div></div>{!!a.repair.tools?.length&&<><h3>Ferramentas</h3><div className={ui.tagWrap}>{a.repair.tools.map((x,i)=><span className={ui.tag} key={i}>{x}</span>)}</div></>}{!!a.repair.steps?.length&&<><h3 style={{marginTop:10}}>Passos seguros</h3><ol className={ui.list}>{a.repair.steps.map((x,i)=><li key={i}>{x}</li>)}</ol></>}</section>}
  <section className={ui.section}><div className={ui.videoHeader}><h3>▶️ Vídeos encontrados para este defeito</h3>{m.youtubeSearchUrl&&<a href={m.youtubeSearchUrl} target="_blank" rel="noreferrer">VER MAIS NO YOUTUBE ↗</a>}</div>
   {m.videos?.length?<div className={ui.videoGrid}>{m.videos.slice(0,4).map((v,i)=><article className={ui.videoCard} key={v.id}><div className={ui.videoFrame}><iframe src={"https://www.youtube-nocookie.com/embed/"+v.id+"?rel=0&modestbranding=1"} title={v.title} allowFullScreen loading="lazy"/></div><div className={ui.videoInfo}><b>{i===0?"★ Mais relevante — ":""}{v.title}</b><span>{v.channel}</span><a href={"https://www.youtube.com/watch?v="+v.id} target="_blank" rel="noreferrer">Abrir no YouTube ↗</a></div></article>)}</div>:<div className={ui.emptyVideos}>A busca automática do YouTube não retornou vídeos incorporáveis agora. Use a pesquisa preparada abaixo para abrir os resultados diretamente no YouTube.</div>}
  </section>
  {!!a.search_terms?.length&&<section className={ui.section}><h3>🌍 Buscas técnicas em vários idiomas</h3>{a.search_terms.map((x,i)=><div className={ui.searchTerm} key={i}>{x}</div>)}</section>}
  {a.follow_up_question&&<div className={ui.question}>💬 {a.follow_up_question}</div>}
 </div>
}

export default function Diagnostico(){
 const [car,setCar]=useState(audi),[msgs,setMsgs]=useState([welcome]),[input,setInput]=useState(""),[loading,setLoading]=useState(false),[side,setSide]=useState(false),[recording,setRecording]=useState(false),[health,setHealth]=useState(null);
 const end=useRef(null),photoRef=useRef(null),recorderRef=useRef(null),chunksRef=useRef([]);
 useEffect(()=>end.current?.scrollIntoView({behavior:"smooth"}),[msgs,loading]);\n useEffect(()=>{fetch("/api/diagnostico",{cache:"no-store"}).then(r=>r.json()).then(setHealth).catch(()=>setHealth({ok:false,gemini:false,youtube:false}))},[]);
 const summary=[car.brand,car.model,car.version,car.year,car.motor].filter(Boolean).join(" • ");

 async function send(q=input,media=null){
  q=(q||"").trim();if((!q&&!media)||loading)return;
  const prefix=media?.kind==="audio"?"🎧 Barulho do veículo enviado":media?.kind==="image"?"📷 Foto do veículo enviada":"";
  const shown=[prefix,q].filter(Boolean).join("\n");
  const next=[...msgs,{role:"user",text:shown}];
  setMsgs(next);setInput("");setLoading(true);
  try{
   const history=next.map(x=>({role:x.role,text:x.text||x.analysis?.summary||""}));
   const r=await fetch("/api/diagnostico",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history,vehicle:car,media})});
   const d=await r.json();if(!r.ok)throw Error(d.error||"Falha na IA");
   setMsgs(m=>[...m,{role:"ai",text:d.analysis?.summary||"Análise concluída.",analysis:d.analysis,videos:d.videos||[],youtubeSearchUrl:d.youtubeSearchUrl||""}]);
  }catch(e){setMsgs(m=>[...m,{role:"ai",alert:e.message||"Erro no diagnóstico."}])}finally{setLoading(false)}
 }

 function reset(){setMsgs([welcome]);setInput("");setSide(false)}
 function apply(){send("Use estes dados como o meu veículo e me diga que tipos de problema você consegue diagnosticar.");setSide(false)}
 function mic(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR)return alert("Use Chrome ou Edge para ditado por voz.");
  const r=new SR();r.lang="pt-BR";r.onresult=e=>setInput(e.results[0][0].transcript);r.start();
 }
 function fileToData(file,kind){
  if(file.size>12*1024*1024)return alert("Arquivo muito grande. Use até 12 MB.");
  const reader=new FileReader();
  reader.onload=()=>send(kind==="image"?"Analise esta foto junto com os dados do meu carro. Diga o que é visível, possíveis defeitos e como confirmar.":"Analise este barulho do meu carro e diga quais fontes são compatíveis e como testar.",{kind,mimeType:file.type||(kind==="audio"?"audio/webm":"image/jpeg"),data:reader.result});
  reader.readAsDataURL(file);
 }
 async function recordSound(){
  if(recording){recorderRef.current?.stop();return}
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)return alert("Seu navegador não permite gravação de áudio aqui.");
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const mime=MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm";
   const rec=new MediaRecorder(stream,{mimeType:mime});chunksRef.current=[];recorderRef.current=rec;
   rec.ondataavailable=e=>{if(e.data.size)chunksRef.current.push(e.data)};
   rec.onstop=()=>{setRecording(false);stream.getTracks().forEach(t=>t.stop());const blob=new Blob(chunksRef.current,{type:rec.mimeType||"audio/webm"});fileToData(blob,"audio")};
   rec.start();setRecording(true);setTimeout(()=>{if(rec.state==="recording")rec.stop()},12000);
  }catch{setRecording(false);alert("Não consegui acessar o microfone. Verifique a permissão do navegador.")}
 }

 return <main className="cleanDiag">
  <header className="cleanHead"><div className="cleanBrand"><button className="mobileMenu" onClick={()=>setSide(!side)}>☰</button><a href="/"><span className="carIcon">🚗</span><div><b>TOTAL<span>CARS</span>.CH</b><small>Diagnóstico inteligente • foto • barulho • vídeo de reparo</small>{health&&<span style={{fontSize:10,marginLeft:8,color:health.gemini?"#35c46a":"#ff5b43"}}>{health.gemini?"● IA ONLINE":"● IA INDISPONÍVEL"}{health.youtube?" · VÍDEOS ONLINE":" · VÍDEOS OPCIONAIS OFF"}</span>}</div><em>🇨🇭 SUÍÇA</em></a></div><div className="headActions"><button onClick={reset}>↻ <span>Novo diagnóstico</span></button><a href="/oficinas">● Encontrar Oficina</a></div></header>
  <div className="cleanWork">{side&&<div className="sideBackdrop" onClick={()=>setSide(false)}/>}<aside className={side?"cleanSide open":"cleanSide"}><div className="sideTitle">🎚️ <b>Identifique o veículo</b><button onClick={()=>setSide(false)}>×</button></div>
   <div className="carForm">
    <label>Marca:<select value={car.brand} onChange={e=>setCar({...car,brand:e.target.value})}>{brands.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Modelo:<input className={ui.fieldInput} value={car.model} onChange={e=>setCar({...car,model:e.target.value})} placeholder="Ex.: A6"/></label>
    <label>Geração / versão:<input className={ui.fieldInput} value={car.version} onChange={e=>setCar({...car,version:e.target.value})} placeholder="Ex.: C7 / 4G"/></label>
    <label>Ano:<input className={ui.fieldInput} value={car.year} onChange={e=>setCar({...car,year:e.target.value})} inputMode="numeric" placeholder="Ex.: 2015"/></label>
    <label>Motor / tração:<input className={ui.fieldInput} value={car.motor} onChange={e=>setCar({...car,motor:e.target.value})} placeholder="Ex.: 3.0 TDI Quattro"/></label>
    <label>VIN opcional:<input className={ui.fieldInput} value={car.vin} maxLength={17} onChange={e=>setCar({...car,vin:e.target.value.toUpperCase()})} placeholder="17 caracteres"/></label>
    <div className="selectedCard"><small>VEÍCULO ATUAL:</small><b>{summary||"Preencha os dados"}</b><span>● IA usa estes dados para refinar diagnóstico e vídeos</span></div><button className="applyCar" onClick={apply}>✓ Usar este veículo</button>
   </div><footer>TotalCars • Suíça <b>AI + VIDEO</b></footer>
  </aside>
  <section className="cleanChat"><div className="chatSub"><span>●</span><b>{summary||"Veículo não definido"}</b><em>• Diagnóstico multimodal</em><button onClick={reset}>↻ Reiniciar</button></div>
   <div className="cleanMessages">{msgs.map((m,i)=><div className={"cleanMsg "+m.role} key={i}>{m.role==="ai"&&<span className="wrench">🔧</span>}<div>{m.alert&&<p className="danger">{m.alert}</p>}{m.analysis?<Result m={m}/>:m.text&&<p>{m.text}</p>}</div></div>)}{loading&&<div className="cleanMsg ai"><span className="wrench">⚙️</span><div className="typing">Analisando sintomas e procurando vídeos... <i>● ● ●</i></div></div>}<div ref={end}/></div>
   <div className="cleanChips"><b>EXEMPLOS:</b>{["🔊 Barulho ao ligar","⚠️ Luz do motor","🛑 Vibra ao frear","🐌 Perde força"].map((x,i)=><button key={x} onClick={()=>send(["faz um barulho metálico quando liga e depois para","acendeu a luz do motor no painel","o carro vibra quando eu piso no freio","o carro perdeu força principalmente em subida"][i])}>{x}</button>)}</div>
   <div className={ui.mediaTools}><button onClick={()=>photoRef.current?.click()}>📷 Enviar foto</button><button onClick={recordSound} className={recording?ui.recording:""}>{recording?"⏹ Parar gravação":"🎧 Gravar barulho (12s)"}</button><small>IA analisa imagem e som junto com o veículo</small><input ref={photoRef} type="file" accept="image/*" capture="environment" hidden onChange={e=>{const f=e.target.files?.[0];if(f)fileToData(f,"image");e.target.value=""}}/></div>
   <div className="cleanInput"><form onSubmit={e=>{e.preventDefault();send()}}><button type="button" className="mic" onClick={mic}>🎙</button><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Descreva o defeito, sintoma ou código OBD..."/><button className="send">↑</button></form><small>TotalCars.ch • Triagem remota não substitui inspeção presencial em sistemas críticos.</small></div>
  </section></div>
 </main>
}
