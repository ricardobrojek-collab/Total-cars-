"use client";
import {useState} from "react";
const shops=[
["ReifenDirekt.ch","Pneus de verão, inverno, all-season, rodas e rede de parceiros de montagem.","https://www.reifendirekt.ch/"],
["AUTODOC Schweiz","Pneus, jantes e peças automotivas.","https://www.auto-doc.ch/"],
["BestDrive Schweiz","Pneus, rodas e serviços automotivos.","https://www.bestdrive.ch/"],
["Euromaster Schweiz","Pneus, manutenção e serviços para veículos.","https://www.euromaster.ch/"],
["Derendinger","Pneus, rodas e peças para automóveis.","https://www.derendinger.ch/"],
["ESA","Pneus, rodas, acessórios e produtos automotivos.","https://www.esa.ch/"]
];
export default function Page(){const[q,setQ]=useState("");return <main className="shopDirectory"><header className="directoryTop"><a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a><nav><a href="/oficinas">Oficinas</a><a href="/pecas">Peças</a><a href="/revista">Revista</a></nav></header><section className="shopHero"><p className="eyebrow">TOTAL CARS · PNEUS & RODAS</p><h1>Comprar pneus e rodas na Suíça</h1><p>Lojas online, redes de serviço e fornecedores reunidos em um só lugar.</p><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar loja, pneu ou roda…"/></section><section className="shopGrid">{shops.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q.toLowerCase())).map(x=><a href={x[2]} target="_blank" rel="noreferrer" className="shopCard" key={x[0]}><img src={"https://www.google.com/s2/favicons?domain="+new URL(x[2]).hostname+"&sz=128"} alt=""/><div><small>PNEUS / RODAS</small><h2>{x[0]}</h2><p>{x[1]}</p><b>ABRIR SITE →</b></div></a>)}</section></main>}