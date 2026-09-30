"use client";
import {useMemo,useState} from "react";
const rules=[
 {keys:["partida","liga","arranque","clec","tec"],causes:["Tensão da bateria / motor de arranque","Tensor, polia ou acessórios","Pressão de óleo demorando a subir"],checks:["Confira nível do óleo com o carro nivelado","Observe se o ruído muda com motor frio/quente","Meça a bateria antes e durante a partida"]},
 {keys:["ventoinha","ventilador"],causes:["Regeneração do DPF em diesel","Temperatura elevada do sistema","Sensor/relé da ventoinha"],checks:["Veja a temperatura no painel","Observe se acontece após trajeto curto ou regeneração","Faça leitura OBD se houver luz de avaria"]},
 {keys:["suspensão","estalo","batida","baixo"],causes:["Bieleta/bucha/braço de suspensão","Mola ou amortecedor","Sistema pneumático, se equipado"],checks:["Compare a altura nos quatro cantos","Escute em lombadas e esterçando parado","Inspecione pneus e vazamentos visíveis"]},
 {keys:["freio","travão","chiado"],causes:["Pastilhas/discos","Chapa protetora ou corpo estranho","Pinça com movimento irregular"],checks:["Não continue se houver perda de frenagem","Compare aquecimento das rodas","Faça inspeção de pastilhas e discos"]},
];
export default function Diagnostico(){
 const [text,setText]=useState(""); const [started,setStarted]=useState(false);
 const match=useMemo(()=>rules.find(r=>r.keys.some(k=>text.toLowerCase().includes(k))),[text]);
 const causes=match?.causes||["Precisamos de mais detalhes para restringir as causas","Sistema elétrico/eletrônico","Componente mecânico relacionado ao sintoma"];
 const checks=match?.checks||["Informe marca, modelo, ano e motor","Diga quando o sintoma aparece e por quanto tempo","Informe luzes no painel, ruído, cheiro, vibração ou vazamento"];
 const yt="https://www.youtube.com/results?search_query="+encodeURIComponent(text+" diagnóstico automóvel");
 return <main className="diagPage"><header className="diagTop"><a href="/" className="brand">TOTAL <b>CARS</b><span>.CH</span></a><a href="/">← Início</a></header>
 <section className="diagHero"><p className="eyebrow">TOTAL CARS • DIAGNÓSTICO</p><h1>Encontre pistas para o defeito do seu carro</h1><p>Escreva marca, modelo, motor e o que acontece. O sistema organiza causas prováveis e testes iniciais. Não substitui inspeção mecânica.</p>
 <div className="diagBox"><textarea value={text} onChange={e=>{setText(e.target.value);setStarted(false)}} placeholder="Ex.: Audi A6 3.0 TDI 2014 faz clec-clec por 2 segundos somente na partida a frio..."/><button disabled={!text.trim()} onClick={()=>setStarted(true)}>Analisar sintoma</button></div>
 {started&&<div className="diagResult"><h2>🔧 Triagem do sintoma</h2><p><b>Relato:</b> {text}</p><h3>Possibilidades a investigar</h3><ol>{causes.map(x=><li key={x}>{x}</li>)}</ol><h3>Verificações iniciais</h3><ol>{checks.map(x=><li key={x}>{x}</li>)}</ol><div className="diagSteps"><span>Sintoma</span><span>Causas</span><span>Testes</span><span>Próximo passo</span></div><p><a className="buttonLink" target="_blank" rel="noreferrer" href={yt}>▶ Buscar vídeos deste sintoma</a></p><p><small>Se houver luz vermelha de óleo/temperatura, perda de freio, fumaça intensa ou ruído mecânico forte, pare o veículo e procure assistência.</small></p></div>}
 </section></main>
}