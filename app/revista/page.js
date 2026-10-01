"use client";
import {useEffect,useMemo,useState} from "react";
const sections=["CAPA","ÍNDICE","MUNDO","SUÍÇA","LANÇAMENTOS","CHINA & ÁSIA","ELÉTRICOS","SUPERCARROS","TECNOLOGIA","TESTES","MERCADO","CLÁSSICOS","MECÂNICA","EVENTOS"];
export default function Revista(){
 const [edition,setEdition]=useState(null),[p,setP]=useState(0),[open,setOpen]=useState(false);
 useEffect(()=>{fetch("/api/revista",{cache:"no-store"}).then(r=>r.json()).then(d=>setEdition(d)).catch(()=>{})},[]);
 const pages=edition?.pages||[]; const page=pages[p]; const pct=pages.length?Math.round((p+1)/pages.length*100):0;
 const grouped=useMemo(()=>sections.map(s=>[s,pages.filter(x=>x.section===s)]).filter(x=>x[1].length),[pages]);
 const go=n=>setP(Math.max(0,Math.min(pages.length-1,n)));
 return <main className="paperMagazine">
  <header className="paperTop"><a href="/" className="premiumLogo"><span>TOTAL</span> CARS<em>.CH</em></a><div><b>EDIÇÃO {edition?.edition||"—"}</b><span>{edition?.updatedLabel||"Carregando edição..."}</span></div><button onClick={()=>setOpen(!open)}>☰ ÍNDICE</button></header>
  {open&&<aside className="paperIndex"><button onClick={()=>setOpen(false)}>FECHAR ×</button><h2>ÍNDICE</h2>{grouped.map(([s,arr])=><div key={s}><b>{s}</b>{arr.slice(0,8).map(x=><button key={x.page} onClick={()=>{go(x.page-1);setOpen(false)}}>{String(x.page).padStart(2,"0")} {x.title}</button>)}</div>)}</aside>}
  {!page?<section className="paperLoading"><h1>REVISTA TOTAL CARS</h1><p>Abrindo a edição já preparada...</p></section>:
  <section className={"paperSpread "+(page.type||"article")}>
   <div className="paperVisual" style={page.image?{backgroundImage:`linear-gradient(0deg,#050505aa,#05050510),url("${page.image}")`}:{}}><span>{page.section}</span><div><small>PÁGINA {String(page.page).padStart(2,"0")}</small><h1>{page.title}</h1><h2>{page.subtitle}</h2></div></div>
   <article className="paperArticle"><header><span>TOTAL CARS · {page.section}</span><b>{edition?.issueDate}</b></header><h1>{page.headline||page.title}</h1>{page.deck&&<h2>{page.deck}</h2>}<div className="paperColumns">{(page.paragraphs||[]).map((x,i)=><p key={i}>{x}</p>)}</div>{page.highlights?.length>0&&<div className="paperHighlights">{page.highlights.map(x=><span key={x}>{x}</span>)}</div>}{page.sourceUrl&&<a href={page.sourceUrl} target="_blank" rel="noreferrer">FONTE ORIGINAL ↗</a>}<footer>REVISTA TOTAL CARS · {page.page}</footer></article>
  </section>}
  <nav className="paperControls"><button disabled={p===0} onClick={()=>go(p-1)}>← ANTERIOR</button><div><b>{p+1} / {pages.length||"—"}</b><span><i style={{width:pct+"%"}}/></span></div><button disabled={!pages.length||p===pages.length-1} onClick={()=>go(p+1)}>PRÓXIMA →</button></nav>
 </main>
}