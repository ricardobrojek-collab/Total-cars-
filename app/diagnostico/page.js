"use client";
import {useMemo,useState} from "react";
const data={
 Audi:{models:["A6","A4","A3","Q5","Q7"],versions:["C7 (2011–2018)","C6 (2004–2011)","C8 (2018–presente)"],motors:["3.0 TDI Quattro","2.0 TDI","3.0 TFSI"]},
 Volkswagen:{models:["Golf","Passat","Tiguan","Caddy"],versions:["Selecione a geração"],motors:["2.0 TDI","1.5 TSI","2.0 TSI"]},
 BMW:{models:["Série 3 (F30)","Série 5 (F10)","X3","X5"],versions:["Selecione a geração"],motors:["Diesel","Gasolina"]},
 "Mercedes-Benz":{models:["Classe C (W205)","Classe E (W212)","GLC","Vito"],versions:["Selecione a geração"],motors:["Diesel","Gasolina"]},
 Skoda:{models:["Octavia","Superb","Kodiaq"],versions:["Selecione a geração"],motors:["2.0 TDI","1.5 TSI"]},
 Porsche:{models:["Cayenne","Macan","Panamera"],versions:["Selecione a geração"],motors:["Gasolina","Diesel","Híbrido"]}
};
const starter=[
 {role:"user",text:"meu audi quebrou a mola traseira"},
 {role:"ai",text:"Entendi — no seu Audi A6 3.0 TDI Quattro, então aquele problema que você comentou na traseira era a mola traseira quebrada, e não a bolsa pneumática.\n\n⚠️ Evite rodar assim: principalmente se a mola saiu da posição ou existe uma ponta quebrada encostando perto do pneu. Ela pode danificar componentes próximos.\n\nA mola ainda está presa ou desencaixou do suporte/prato inferior?"},
 {role:"user",text:"sim saiu do suporte"},
 {role:"ai",text:"Aí muda bastante: se a mola traseira saiu do suporte/prato, eu não recomendo continuar rodando com o Audi até verificar, pois há risco de encostar na parte interna da roda.",video:true}
];
export default function Diagnostico(){
 const [car,setCar]=useState({brand:"Audi",model:"A6",version:"C7 (2011–2018)",year:"2014",motor:"3.0 TDI Quattro"});
 const [msgs,setMsgs]=useState(starter),[input,setInput]=useState(""),[loading,setLoading]=useState(false),[err,setErr]=useState("");
 const active=useMemo(()=>`${car.brand} ${car.model} ${car.version} (${car.year}) • ${car.motor}`,[car]);
 function changeBrand(v){const d=data[v];setCar(c=>({...c,brand:v,model:d.models[0],version:d.versions[0],motor:d.motors[0]}))}
 async function send(q=input){q=q.trim();if(!q||loading)return;const shown={role:"user",text:q};setMsgs(m=>[...m,shown]);setInput("");setLoading(true);setErr("");
  try{const history=[...msgs,{role:"user",text:`VEÍCULO ATIVO: ${active}. SINTOMA/PERGUNTA: ${q}`}];const r=await fetch("/api/diagnostico",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history})});const d=await r.json();if(!r.ok)throw new Error(d?.error||"Falha na IA");setMsgs(m=>[...m,{role:"ai",text:d.text}])}catch(e){setErr(e.message||"Erro")}finally{setLoading(false)}
 }
 return <main className="diagnosticMock">
  <header className="dmHeader"><a href="/" className="dmBrand"><span>T</span><div><b>TOTAL<em>CARS</em>.CH</b><small>Diagnóstico Mecânico Inteligente & Vídeos Integrados</small></div></a><div className="dmHeaderRight"><i><u></u> Sistema Ativo</i><a href="https://wa.me/41790000000" target="_blank">● WhatsApp Oficina</a></div></header>
  <div className="dmBody"><aside className="dmAside"><div><div className="dmAsideTitle"><b>DADOS DO VEÍCULO</b><button onClick={()=>setCar({brand:"Audi",model:"A6",version:"C7 (2011–2018)",year:"2014",motor:"3.0 TDI Quattro"})}>Carregar Audi A6</button></div>
   <label>Marca<select value={car.brand} onChange={e=>changeBrand(e.target.value)}>{Object.keys(data).map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Modelo<select value={car.model} onChange={e=>setCar({...car,model:e.target.value})}>{data[car.brand].models.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Geração / Versão<select value={car.version} onChange={e=>setCar({...car,version:e.target.value})}>{data[car.brand].versions.map(x=><option key={x}>{x}</option>)}</select></label>
   <div className="dmTwo"><label>Ano<select value={car.year} onChange={e=>setCar({...car,year:e.target.value})}>{Array.from({length:31},(_,i)=>2026-i).map(x=><option key={x}>{x}</option>)}</select></label><label>Motor<select value={car.motor} onChange={e=>setCar({...car,motor:e.target.value})}>{data[car.brand].motors.map(x=><option key={x}>{x}</option>)}</select></label></div>
   <div className="dmActive"><b>🚗 Carro Ativo no Diagnóstico:</b><p>{active}</p></div></div><div className="dmSwiss">🇨🇭 TotalCars - Rheintal / St. Gallen<br/>Inspeção MFK & Peças com certificação ASA</div></aside>
   <section className="dmChat">{err&&<div className="chatError">⚠ {err}</div>}<div className="dmMessages">{msgs.map((m,i)=><div key={i} className={"dmRow "+m.role}>{m.role==="ai"&&<span className="dmAvatar">TC</span>}<div className="dmBubble"><p>{m.text}</p>{m.video&&<div className="dmVideo"><div className="dmFrame"><iframe src="https://www.youtube-nocookie.com/embed/fCksnK6c84c" title="Audi A6 Rear Spring Replacement Tutorial" allowFullScreen/></div><div className="dmVideoInfo"><div><b>Audi A6 Quattro (2012–2018) — Troca da Mola Traseira</b><small>Canal: Fixit & Tripit • Passo a passo mecânico</small></div><a href="https://wa.me/41790000000" target="_blank">● Orçar Troca</a></div></div>}</div></div>)}{loading&&<div className="dmRow ai"><span className="dmAvatar">TC</span><div className="dmBubble"><p>Analisando...</p></div></div>}</div>
   <div className="dmQuick"><b>Perguntas Rápidas:</b>{["Posso guinchar o carro?","Custo da peça na Suíça (CHF)","Reprova na MFK?"].map((x,i)=><button key={x} onClick={()=>send(i===0?"Posso guinchar o carro em vez de andar?":i===1?"Quanto custa a peça e o reparo na Suíça em CHF?":"Isso reprova na inspeção da MFK?")}>{x}</button>)}</div>
   <form className="dmInput" onSubmit={e=>{e.preventDefault();send()}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Digite o sintoma, barulho ou código de erro (ou selecione o carro ao lado)..."/><button disabled={loading}>↑</button><small>TotalCars.ch • O diagnóstico inteligente sugere causas mecânicas e exibe tutoriais no próprio diálogo.</small></form>
   </section></div>
 </main>
}