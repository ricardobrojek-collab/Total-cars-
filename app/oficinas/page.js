"use client";
import {useState} from "react";

const fallback=[
 {name:"Bosch Car Service",desc:"Rede de oficinas e manutenção automotiva.",url:"https://www.boschcarservice.com/ch/de/"},
 {name:"Euromaster Schweiz",desc:"Pneus, manutenção e serviços automotivos.",url:"https://www.euromaster.ch/"},
 {name:"BestDrive Schweiz",desc:"Pneus, rodas e serviços para automóveis.",url:"https://www.bestdrive.ch/"}
];
const labels={
 PT:{title:"Encontre oficinas e serviços perto de você",ph:"Digite cidade ou CEP, ex.: 9464 Rüthi",search:"Buscar",loc:"Minha localização",shops:"Oficinas",parts:"Autopeças",tires:"Rodas e pneus",found:"estabelecimentos encontrados",map:"Ver no mapa",near:"Mostrando resultados perto de",official:"Redes e lojas com site oficial",open:"Abrir site",loading:"Localizando..."},
 DE:{title:"Werkstätten und Services in Ihrer Nähe finden",ph:"Stadt oder PLZ eingeben, z. B. 9464 Rüthi",search:"Suchen",loc:"Mein Standort",shops:"Werkstätten",parts:"Autoteile",tires:"Räder & Reifen",found:"Betriebe gefunden",map:"Auf Karte ansehen",near:"Ergebnisse in der Nähe von",official:"Netzwerke und Anbieter mit offizieller Website",open:"Website öffnen",loading:"Standort wird ermittelt..."}
};
export default function Page(){
 const [lang,setLang]=useState("PT"),[q,setQ]=useState(""),[place,setPlace]=useState("Schweiz"),[busy,setBusy]=useState(false),[tab,setTab]=useState("shops"); const t=labels[lang]||labels.PT;
 const go=()=>{if(q.trim())setPlace(q.trim())};
 const locate=()=>{if(!navigator.geolocation)return;setBusy(true);navigator.geolocation.getCurrentPosition(p=>{setPlace("sua localização atual");setBusy(false);window.open("https://www.google.com/maps/search/"+encodeURIComponent(tab==="shops"?"oficina mecânica":tab==="parts"?"autopeças":"pneus")+"/@"+p.coords.latitude+","+p.coords.longitude+",13z","_blank")},()=>setBusy(false))};
 const mapQuery=(tab==="shops"?"oficina mecânica ":tab==="parts"?"autopeças ":"pneus ")+place;
 return <main className="directoryPage">
  <header className="directoryTop"><a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a><nav><a href="/marketplace">Comprar carro</a><a href="/revista">Revista</a><a href="/fichas">Fichas técnicas</a><a href="/pneus">Rodas e pneus</a><a href="/eventos">Eventos</a><a href="/oficinas">Oficinas</a><a href="/pecas">Autopeças</a></nav><select value={lang} onChange={e=>setLang(e.target.value)}><option>PT</option><option>DE</option></select><a className="announce" href="/anunciar">ANUNCIAR</a></header>
  <section className="directoryHero"><p className="eyebrow">TOTAL CARS LOCAL</p><h1>{t.title}</h1><div className="directorySearch"><span>⌖</span><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={t.ph}/><button onClick={go}>⌕ {t.search}</button><button className="locate" onClick={locate}>◎ {busy?t.loading:t.loc}</button></div><small>{t.near} <b>{place}</b>.</small></section>
  <section className="directoryBody"><div className="directoryTabs"><button className={tab==="shops"?"active":""} onClick={()=>setTab("shops")}>{t.shops}</button><button className={tab==="parts"?"active":""} onClick={()=>setTab("parts")}>{t.parts}</button><button className={tab==="tires"?"active":""} onClick={()=>setTab("tires")}>{t.tires}</button></div>
  <div className="directoryHeading"><div><p className="eyebrow">{String(place).toUpperCase()}</p><h2>{fallback.length} {t.found}</h2></div><a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/search/"+encodeURIComponent(mapQuery)}>{t.map} ↗</a></div>
  <div className="officialBox"><h3>{t.official}</h3><div className="directoryCards">{fallback.map(x=><article key={x.name}><h4>{x.name}</h4><p>{x.desc}</p><a target="_blank" rel="noreferrer" href={x.url}>{t.open} ↗</a></article>)}</div></div></section>
 </main>
}