"use client";
import {useState} from "react";
export default function Diagnostico(){
 const [text,setText]=useState(""); const [started,setStarted]=useState(false);
 return <main className="diagPage"><header className="diagTop"><a href="/" className="brand">TOTAL <b>CARS</b><span>.CH</span></a><a href="/">← Voltar</a></header>
 <section className="diagHero"><p className="eyebrow">DIAGNÓSTICO INTELIGENTE</p><h1>O que está acontecendo com seu carro?</h1><p>Conte o sintoma do jeito que você explicaria para um mecânico: barulho, vibração, luz no painel, vazamento ou comportamento estranho.</p>
 <div className="diagBox"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ex.: Meu Audi A6 3.0 TDI está baixo do lado traseiro esquerdo e faz estalos quando ando..."/><button onClick={()=>setStarted(true)}>Analisar meu carro</button></div>
 {started&&<div className="diagResult"><h2>🔧 Entendi o problema</h2><p><b>Seu relato:</b> {text||"Descreva o sintoma acima."}</p><p>Esta área está preparada para o Diagnóstico IA. A próxima etapa é conectar a análise inteligente para fazer perguntas, sugerir possíveis causas e buscar vídeos relacionados ao seu modelo e sintoma.</p><div className="diagSteps"><span>1. Sintomas</span><span>2. Perguntas</span><span>3. Possíveis causas</span><span>4. Vídeos e próximos passos</span></div></div>}
 </section></main>
}