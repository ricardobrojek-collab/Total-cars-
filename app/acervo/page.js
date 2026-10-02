"use client";
import {useState} from "react";

export default function Acervo(){
 const [q,setQ]=useState("Porsche"),[cars,setCars]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState("");
 async function search(e){e?.preventDefault();setLoading(true);setError("");try{const r=await fetch("/api/car-history?q="+encodeURIComponent(q));const d=await r.json();if(!r.ok)throw Error(d.error||"Falha na busca");setCars(d.cars||[])}catch(e){setError(e.message)}finally{setLoading(false)}}
 return <main style={{maxWidth:1180,margin:"0 auto",padding:"32px 20px",fontFamily:"Arial,sans-serif"}}>
  <a href="/" style={{textDecoration:"none",color:"inherit"}}>← TOTALCARS.CH</a>
  <h1 style={{fontSize:"clamp(32px,5vw,64px)",marginBottom:8}}>Acervo Automotivo</h1>
  <p style={{fontSize:18,color:"#555"}}>Pesquise marcas e modelos e explore veículos e imagens de referência do acervo aberto Wikidata/Wikimedia.</p>
  <form onSubmit={search} style={{display:"flex",gap:10,margin:"28px 0",flexWrap:"wrap"}}>
   <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex.: Porsche 911, Audi A6, BMW M3" style={{flex:"1 1 300px",padding:16,border:"1px solid #bbb",borderRadius:12,fontSize:16}}/>
   <button disabled={loading} style={{padding:"16px 24px",border:0,borderRadius:12,fontWeight:800,cursor:"pointer"}}>{loading?"Buscando...":"Pesquisar"}</button>
  </form>
  {error&&<p>{error}</p>}
  {!loading&&!cars.length&&!error&&<div style={{padding:"40px 0",color:"#666"}}>Faça uma pesquisa para abrir o acervo.</div>}
  <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18}}>
   {cars.map(car=><article key={car.id} style={{border:"1px solid #ddd",borderRadius:18,overflow:"hidden",background:"#fff"}}>
    <img src={car.imageUrl} alt={car.name} style={{width:"100%",height:180,objectFit:"cover",display:"block"}}/>
    <div style={{padding:16}}><h2 style={{fontSize:18,margin:"0 0 6px"}}>{car.name}</h2><span style={{color:"#666"}}>{car.year||"Ano não confirmado"}</span></div>
   </article>)}
  </section>
  <p style={{marginTop:28,fontSize:13,color:"#777"}}>Imagens e metadados vêm de fontes abertas. O ano exibido é informativo e não substitui a identificação exata de geração/versão do veículo.</p>
 </main>
}