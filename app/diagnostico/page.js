"use client";
import {useEffect,useState} from "react";

const welcome={role:"ai",text:"Olá! Sou o Total Cars AI. Informe o carro e descreva o problema. Vou acompanhar o contexto da conversa e investigar com você por etapas."};

export default function Diagnostico(){
  const [input,setInput]=useState("");
  const [msgs,setMsgs]=useState([welcome]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{try{const x=JSON.parse(localStorage.getItem("tc_diag")||"null");if(x?.length)setMsgs(x)}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem("tc_diag",JSON.stringify(msgs))}catch{}},[msgs]);

  async function send(){
    const q=input.trim();
    if(!q||loading)return;
    const userMsg={role:"user",text:q};
    const next=[...msgs,userMsg];
    setMsgs(next); setInput(""); setLoading(true);
    try{
      const r=await fetch("/api/diagnostico",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:next})});
      const data=await r.json();
      if(!r.ok) throw new Error(data?.error||"Falha na IA");
      setMsgs(m=>[...m,{role:"ai",text:data.text}]);
    }catch(e){
      setMsgs(m=>[...m,{role:"ai",text:"Não consegui falar com a IA agora. Tente novamente em alguns segundos."}]);
    }finally{setLoading(false)}
  }

  function reset(){setMsgs([welcome]);localStorage.removeItem("tc_diag")}

  return <main className="chatPage">
    <header className="chatTop"><a href="/" className="premiumLogo"><span>TOTAL</span> CARS<em>.CH</em></a><div><span>PT</span><span>DE</span><button onClick={reset}>+ NOVA CONVERSA</button></div></header>
    <div className="chatShell">
      <aside><b>DIAGNÓSTICO</b><p>Conversa atual</p><small>O histórico fica salvo neste navegador.</small></aside>
      <section className="chatMain">
        <div className="chatTitle"><span>TC</span><div><b>Total Cars AI</b><small>Diagnóstico automotivo com GPT</small></div></div>
        <div className="messages">{msgs.map((m,i)=><div className={"message "+m.role} key={i}><b>{m.role==="ai"?"TOTAL CARS AI":"VOCÊ"}</b><p>{m.text}</p></div>)}{loading&&<div className="message ai"><b>TOTAL CARS AI</b><p>Analisando...</p></div>}</div>
        <div className="chatInput"><textarea value={input} disabled={loading} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Descreva o problema do seu carro..."/><button disabled={loading} onClick={send}>{loading?"AGUARDE...":"ENVIAR ↑"}</button></div>
        <small className="chatDisclaimer">Triagem informativa. Problemas de segurança exigem inspeção profissional.</small>
      </section>
    </div>
  </main>
}
