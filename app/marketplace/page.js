"use client";
import {useMemo,useState} from "react";
const cars=[
{id:1,brand:"Audi",model:"A6 3.0 TDI Quattro",year:2014,km:178000,price:12900,fuel:"Diesel",gear:"Automático",mfk:true,trade:true,place:"St. Gallen"},
{id:2,brand:"BMW",model:"320d xDrive",year:2016,km:149000,price:8900,fuel:"Diesel",gear:"Automático",mfk:true,trade:false,place:"Zürich"},
{id:3,brand:"Jeep",model:"Grand Cherokee",year:2012,km:191000,price:9900,fuel:"Diesel",gear:"Automático",mfk:true,trade:true,place:"Thurgau"},
{id:4,brand:"Volkswagen",model:"Golf 1.4 TSI",year:2017,km:112000,price:11900,fuel:"Benzina",gear:"Manual",mfk:false,trade:false,place:"Bern"},
{id:5,brand:"Mercedes-Benz",model:"C 220 d",year:2018,km:136000,price:19900,fuel:"Diesel",gear:"Automático",mfk:true,trade:true,place:"Luzern"},
{id:6,brand:"Toyota",model:"Yaris Hybrid",year:2020,km:68000,price:16900,fuel:"Híbrido",gear:"Automático",mfk:true,trade:false,place:"Aargau"}
];
export default function Marketplace(){
 const [q,setQ]=useState("");const [brand,setBrand]=useState("");const [max,setMax]=useState("");const [trade,setTrade]=useState(false);const [mfk,setMfk]=useState(false);
 const shown=useMemo(()=>cars.filter(c=>(!q||(`${c.brand} ${c.model} ${c.place}`).toLowerCase().includes(q.toLowerCase()))&&(!brand||c.brand===brand)&&(!max||c.price<=Number(max))&&(!trade||c.trade)&&(!mfk||c.mfk)),[q,brand,max,trade,mfk]);
 return <main className="simplePage"><header className="top"><a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a><nav><a href="/anunciar">Vender</a><a href="/garagem">♡ Garagem</a><a href="/">← Início</a></nav></header>
 <section className="simpleHero"><p className="eyebrow">MARKETPLACE</p><h1>Encontre seu próximo carro</h1><p>Busca por marca, modelo, preço, MFK, troca e região. Os veículos abaixo são dados demonstrativos enquanto conectamos a base real de anúncios.</p></section>
 <section className="filterPanel"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Marca, modelo ou região"/><select value={brand} onChange={e=>setBrand(e.target.value)}><option value="">Todas as marcas</option>{[...new Set(cars.map(c=>c.brand))].map(x=><option key={x}>{x}</option>)}</select><select value={max} onChange={e=>setMax(e.target.value)}><option value="">Qualquer preço</option><option value="10000">Até CHF 10'000</option><option value="15000">Até CHF 15'000</option><option value="20000">Até CHF 20'000</option></select><label><input type="checkbox" checked={mfk} onChange={e=>setMfk(e.target.checked)}/> Com MFK</label><label><input type="checkbox" checked={trade} onChange={e=>setTrade(e.target.checked)}/> Aceita troca</label></section>
 <section className="marketWrap"><div className="resultHead"><b>{shown.length} veículos</b><a className="buttonLink" href="/anunciar">+ ANUNCIAR</a></div><div className="vehicleGrid">{shown.map(c=><article className="vehicleCard" key={c.id}><div className="vehiclePhoto">🚘<span>{c.year}</span></div><div className="vehicleBody"><small>{c.place}</small><h3>{c.brand} {c.model}</h3><p>{c.km.toLocaleString("de-CH")} km • {c.fuel} • {c.gear}</p><div className="badges">{c.mfk&&<span>MFK</span>}{c.trade&&<span>ACEITA TROCA</span>}</div><strong>CHF {c.price.toLocaleString("de-CH")}</strong><button onClick={()=>alert("Favorito salvo nesta demonstração.")}>♡ Favoritar</button></div></article>)}</div></section></main>
}