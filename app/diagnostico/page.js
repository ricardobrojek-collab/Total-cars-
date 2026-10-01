"use client";
import {useEffect,useMemo,useState} from "react";

const catalog={
 Audi:{models:["A6","A4","A3","Q5","Q7"],versions:["C7 (2011–2018)","C6 (2004–2011)","C8 (2018–presente)"],motors:["3.0 TDI Quattro","2.0 TDI","3.0 TFSI"]},
 Volkswagen:{models:["Golf","Passat","Tiguan","Caddy"],versions:["Selecione a geração"],motors:["2.0 TDI","1.5 TSI","2.0 TSI"]},
 BMW:{models:["Série 3 (F30)","Série 5 (F10)","X3","X5"],versions:["Selecione a geração"],motors:["Diesel","Gasolina"]},
 "Mercedes-Benz":{models:["Classe C (W205)","Classe E (W212)","GLC","Vito"],versions:["Selecione a geração"],motors:["Diesel","Gasolina"]},
 Skoda:{models:["Octavia","Superb","Kodiaq"],versions:["Selecione a geração"],motors:["2.0 TDI","1.5 TSI"]},
 Porsche:{models:["Cayenne","Macan","Panamera"],versions:["Selecione a geração"],motors:["Gasolina","Diesel","Híbrido"]}
};
const welcome={role:"ai",text:"Olá! Sou o Total Cars AI. Selecione seu veículo e descreva o sintoma, barulho ou código de erro. Vou investigar com você por etapas."};
export default function Diagnostico(){
 const [car,setCar]=useState({brand:"Audi",model:"A6",version:"C7 (2011–2018)",year:"2014",motor:"3.0 TDI Quattro"});
 const [msgs,setMsgs]=useState([welcome]),[input,setInput]=useState(""),[loading,setLoading]=useState(false),[err,setErr]=useState("");
 useEffect(()=>{try{const x=JSON.parse(localStorage.getItem("tc_diag")||"null");if(x?.length)setMsgs(x)}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem("tc_diag",JSON.stringify(msgs))}catch{}},[msgs]);
 const active=useMemo(()=>`${car.brand} ${car.model} ${car.version} (${car.year}) • ${car.motor}`,[car]);
 function brand(v){const d=catalog[v];setCar(c=>({...c,brand:v,model:d.models[0],version:d.versions[0],motor:d.motors[0]}))}
 async function send(q=input){q=q.trim();if(!q||loading)return;const user={role:"user",text:q};const context={role:"user",text:`VEÍCULO ATIVO: ${active}. SINTOMA/PERGUNTA: ${q}`};setMsgs(m=>[...m,user]);setInput("");setLoading(true);setErr("");
  try{const history=[...msgs,context];const r=await fetch("/api/diagnostico",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history})});const d=await r.json();if(!r.ok)throw new Error(d?.error||"Falha na IA");setMsgs(m=>[...m,{role:"ai",text:d.text}])}
  catch(e){setErr(e.message||"Erro");setMsgs(m=>[...m,{role:"ai",text:"Não consegui responder agora. "+(e.message||"Tente novamente.")}])}finally{setLoading(false)}
 }
 function reset(){if(!confirm("Excluir toda a conversa antiga?"))return;localStorage.removeItem("tc_diag");setMsgs([welcome]);setErr("")}
 return <main className="diagV2">
  <header className="diagHeader"><a href="/" className="premiumLogo"><span>TOTAL</span> CARS<em>.CH</em></a><div><b>Diagnóstico Mecânico Inteligente</b><small>Gemini • conversa com contexto</small></div><button onClick={reset}>🗑 Nova conversa</button></header>
  <div className="diagGrid"><aside className="vehiclePanel"><div className="panelTitle"><b>DADOS DO VEÍCULO</b><button onClick={()=>setCar({brand:"Audi",model:"A6",version:"C7 (2011–2018)",year:"2014",motor:"3.0 TDI Quattro"})}>Carregar Audi A6</button></div>
   <label>Marca<select value={car.brand} onChange={e=>brand(e.target.value)}>{Object.keys(catalog).map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Modelo<select value={car.model} onChange={e=>setCar({...car,model:e.target.value})}>{catalog[car.brand].models.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Geração / Versão<select value={car.version} onChange={e=>setCar({...car,version:e.target.value})}>{catalog[car.brand].versions.map(x=><option key={x}>{x}</option>)}</select></label>
   <div className="twoCols"><label>Ano<select value={car.year} onChange={e=>setCar({...car,year:e.target.value})}>{Array.from({length:31},(_,i)=>2026-i).map(x=><option key={x}>{x}</option>)}</select></label><label>Motor<select value={car.motor} onChange={e=>setCar({...car,motor:e.target.value})}>{catalog[car.brand].motors.map(x=><option key={x}>{x}</option>)}</select></label></div>
   <div className="activeCar"><b>🚗 Carro ativo no diagnóstico</b><p>{active}</p></div><small>🇨🇭 TotalCars • Suíça<br/>Triagem informativa — segurança primeiro.</small>
  </aside>
  <section className="diagChat"><div className="diagStatus"><span>TC</span><div><b>Total Cars AI</b><small>● Sistema ativo • Gemini</small></div></div>{err&&<div className="chatError">⚠ {err}</div>}
   <div className="messages">{msgs.map((m,i)=><div className={"message "+m.role} key={i}><b>{m.role==="ai"?"TOTAL CARS AI":"VOCÊ"}</b><p>{m.text}</p></div>)}{loading&&<div className="message ai"><b>TOTAL CARS AI</b><p>Analisando o veículo e o sintoma...</p></div>}</div>
   <div className="quickDiag"><span>Perguntas rápidas:</span>{["Posso guinchar o carro em vez de andar?","Quanto pode custar o reparo na Suíça?","Isso pode reprovar na MFK?"].map(x=><button key={x} onClick={()=>send(x)}>{x}</button>)}</div>
   <div className="chatInput"><textarea value={input} disabled={loading} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Digite o sintoma, barulho ou código de erro..."/><button disabled={loading} onClick={()=>send()}>{loading?"AGUARDE...":"ENVIAR ↑"}</button></div>
  </section></div>
 </main>
}