"use client";
import {useState} from "react";
const shops=[
["AUTODOC Schweiz","Milhões de peças, pneus, acessórios e busca por veículo.","https://www.auto-doc.ch/"],
["Derendinger","Grande fornecedor suíço de peças, oficina, pneus e rodas.","https://www.derendinger.ch/"],
["ESA","Peças, acessórios, pneus, rodas e equipamentos automotivos.","https://www.esa.ch/"],
["Hostettler Autotechnik","Peças e soluções para o aftermarket automotivo suíço.","https://www.autotechnik.ch/"],
["Autoteile Rümlang","Peças e acessórios automotivos.","https://www.autoteile-ruemlang.ch/"],
["Mister Auto Schweiz","Catálogo online de peças por veículo.","https://www.mister-auto.ch/"],
["ReifenDirekt","Pneus, rodas e parceiros de montagem em toda a Suíça.","https://www.reifendirekt.ch/"]
];
export default function Page(){const[q,setQ]=useState("");return <main className="shopDirectory"><header className="directoryTop"><a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a><nav><a href="/oficinas">Oficinas</a><a href="/pneus">Pneus & rodas</a><a href="/revista">Revista</a></nav></header><section className="shopHero"><p className="eyebrow">TOTAL CARS · PEÇAS</p><h1>Lojas de peças na Suíça</h1><p>Diretório para encontrar peças, acessórios, pneus e fornecedores. Clique para comprar diretamente no site da loja.</p><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar loja ou tipo de peça…"/></section><section className="shopGrid">{shops.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q.toLowerCase())).map(x=><a href={x[2]} target="_blank" rel="noreferrer" className="shopCard" key={x[0]}><img src={"https://www.google.com/s2/favicons?domain="+new URL(x[2]).hostname+"&sz=128"} alt=""/><div><small>LOJA / FORNECEDOR</small><h2>{x[0]}</h2><p>{x[1]}</p><b>ABRIR SITE →</b></div></a>)}</section></main>}