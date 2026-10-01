"use client";
import {useEffect,useState} from "react";

const welcome={role:"ai",text:"Olá! Sou o Total Cars AI. Selecione seu carro e descreva exatamente o sintoma. Vou investigar por etapas e manter os dados do veículo durante a conversa."};
const brands=["Audi","BMW","Mercedes-Benz","Volkswagen","Volvo","Toyota","Peugeot","Renault","Citroën","Ford","Opel","Škoda","SEAT","Fiat","Jeep","Porsche","Outra"];

export default function Diagnostico(){
 const [vehicle,setVehicle]=useState({brand:"",model:"",year:"",engine:"",km:""});
 const [input,setInput]=useState("");
 const [msgs,setMsgs]=useState([welcome]);
 const [loading,setLoading]=useState(false);
 const [err,setErr]=useState("");

 useEffect(()=>{try{const x=JSON.parse(localStorage.getItem("tc_diag")||"null");if(x?.length)setMsgs(x);const v=JSON.parse(localStorage.getItem("tc_vehicle")||"null");if(v)setVehicle(v)}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem("tc_diag",JSON.stringify(msgs))}catch{}},[msgs]);
 useEffect(()=>{try{localStorage.setItem("tc_vehicle",JSON.stringify(vehicle))}catch{}},[vehicle]);

 function field(k,placeholder,type="text"){return <input type={type} value={vehicle[k]} onChange={e=>setVehicle(v=>({...v,[k]:e.target.value}))} placeholder={placeholder}/>}

 async function send(){
  const q=input.trim();
  if(!q||loading)return;
  if(!vehicle.brand||!vehicle.model){setErr("Informe pelo menos a marca e o modelo do carro.");return}
  const car=[vehicle.brand,vehicle.model,vehicle.year,vehicle.engine,vehicle.km&&vehicle.km+" km"].filter(Boolean).join(" • ");
  const user={role:"user",text:q,vehicle:car};
  const next=[...msgs,user];
  setMsgs(next);setInput("");setLoading(true);setErr("");
  try{
   const r=await fetch("/api/diagnostico",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:next,vehicle})});
   const d=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(d?.error||"O diagnóstico está temporariamente indisponível.");
   setMsgs(m=>[...m,{role:"ai",text:d.text}]);
  }catch(e){
   setErr(e.message||"Erro de conexão.");
  }finally{setLoading(false)}
 }

 function reset(){if(!confirm("Excluir a conversa e iniciar um novo diagnóstico?"))return;localStorage.removeItem("tc_diag");setMsgs([welcome]);setInput("");setErr("")}

 return <main className="chatPage">
  <header className="chatTop"><a href="/" className="premiumLogo"><span>TOTAL</span> CARS<em>.CH</em></a><div><button className="deleteChat" onClick={reset}>🗑 EXCLUIR CONVERSA</button><button onClick={reset}>+ NOVO DIAGNÓSTICO</button></div></header>
  <div className="chatShell">
   <aside>
    <b>SEU CARRO</b><p>Informe os dados uma vez.</p>
    <div style={{display:"grid",gap:8}}>
     <select value={vehicle.brand} onChange={e=>setVehicle(v=>({...v,brand:e.target.value}))}><option value="">Marca</option>{brands.map(x=><option key={x}>{x}</option>)}</select>
     {field("model","Modelo (ex.: A6)")}
     {field("year","Ano (ex.: 2012)")}
     {field("engine","Motor (ex.: 3.0 TDI)")}
     {field("km","Quilometragem", "number")}
    </div>
    <small>Esses dados ficam salvos somente neste navegador.</small>
   </aside>
   <section className="chatMain">
    <div className="chatTitle"><span>TC</span><div><b>Total Cars AI</b><small>Diagnóstico automotivo passo a passo</small></div></div>
    <div style={{margin:"12px 0",padding:12,border:"1px solid rgba(255,255,255,.12)",borderRadius:12}}>
     <b>Descreva o sintoma</b><p style={{margin:"6px 0 0",opacity:.75}}>Diga quando acontece, de onde vem o barulho, luzes no painel, perda de força, cheiro, fumaça ou qualquer mudança recente.</p>
    </div>
    {err&&<div className="chatError">⚠ {err}</div>}
    <div className="messages">{msgs.map((m,i)=><div className={"message "+m.role} key={i}><b>{m.role==="ai"?"TOTAL CARS AI":"VOCÊ"}</b>{m.vehicle&&<small style={{display:"block",opacity:.65,marginTop:4}}>{m.vehicle}</small>}<p style={{whiteSpace:"pre-wrap"}}>{m.text}</p></div>)}{loading&&<div className="message ai"><b>TOTAL CARS AI</b><p>Analisando sintomas e histórico...</p></div>}</div>
    <div className="chatInput"><textarea value={input} disabled={loading} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ex.: faz clec-clec por 2 segundos quando ligo frio e depois para..."/><button disabled={loading} onClick={send}>{loading?"ANALISANDO...":"DIAGNOSTICAR ↑"}</button></div>
    <small className="chatDisclaimer">Triagem informativa. Pare de dirigir se houver alerta vermelho, superaquecimento, perda de freio/direção, fumaça intensa ou ruído mecânico severo.</small>
   </section>
  </div>
 </main>
}
