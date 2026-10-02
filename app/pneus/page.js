"use client";
import {useState} from "react";
const shops=[
["ReifenDirekt.ch","Pneus, rodas completas e parceiros de montagem.","https://www.reifendirekt.ch/"],
["reifen.com Schweiz","Pneus, jantes, rodas completas e montagem.","https://www.reifen.com/de-ch/"],
["Pneu Egger","Pneus, rodas e serviços automotivos na Suíça.","https://www.pneu-egger.ch/"],
["BestDrive Schweiz","Pneus, rodas e serviços automotivos.","https://www.bestdrive.ch/"],
["Euromaster Schweiz","Pneus, manutenção e serviços para veículos.","https://www.euromaster.ch/"],
["Derendinger","Pneus, rodas, peças e acessórios.","https://www.derendinger.ch/"],
["ESA","Pneus, rodas, acessórios e produtos automotivos.","https://www.esa.ch/"],
["AUTODOC Schweiz","Pneus, jantes e peças automotivas.","https://www.auto-doc.ch/"],
["Pneus Online Schweiz","Busca e compra online de pneus.","https://www.pneus-online-schweiz.ch/"],
["Tirendo Schweiz","Loja online de pneus e acessórios.","https://www.tirendo.ch/"]
];
export default function Page(){const[q,setQ]=useState("");return <main className="shopDirectory whiteDirectory"><header className="directoryTop"><a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a><nav><a href="/oficinas">Oficinas</a><a href="/pecas">Peças</a><a href="/revista">Revista</a></nav></header><section className="shopHero whiteHero"><p className="eyebrow">TOTAL CARS · PNEUS & RODAS</p><h1>Pneus e rodas na Suíça</h1><p>Diretório de lojas online e redes que vendem pneus, jantes e rodas completas para a Suíça.</p><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar loja, pneu ou roda…"/></section><section className="shopGrid centeredDirectory">{shops.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q.toLowerCase())).map(x=><a href={x[2]} target="_blank" rel="noreferrer" className="shopCard" key={x[0]}><img src={"https://www.google.com/s2/favicons?domain="+new URL(x[2]).hostname+"&sz=128"} alt=""/><div><small>PNEUS / RODAS</small><h2>{x[0]}</h2><p>{x[1]}</p><b>ABRIR SITE →</b></div></a>)}</section></main>}