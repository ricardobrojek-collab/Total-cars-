const categories = [
  ["🚗","Carros","Novos, usados e oportunidades em toda a Suíça"],
  ["🔧","Peças","Peças novas e usadas, lojas e fornecedores"],
  ["🛞","Rodas e pneus","Pneus de verão, inverno e conjuntos completos"],
  ["♻️","Desmanches","Peças usadas e auto-recycling por região"],
  ["📅","Eventos","Encontros e eventos automotivos na Suíça"],
  ["📰","Revista","Notícias, guias de compra e conteúdo automotivo"]
];

export default function Home() {
 return <main>
   <header className="top"><div className="brand">TOTAL <b>CARS</b><span>.CH</span></div><nav><a href="#buscar">Comprar</a><a href="#categorias">Peças</a><a href="#eventos">Eventos</a><button>Anunciar grátis</button></nav></header>
   <section className="hero" id="buscar"><div className="heroText"><p className="eyebrow">SUÍÇA • AUTOMÓVEIS • TUDO EM UM SÓ LUGAR</p><h1>Seu próximo carro começa aqui.</h1><p>Pesquise carros, peças, pneus, serviços e oportunidades automotivas em uma experiência simples.</p>
   <div className="search"><select defaultValue=""><option value="" disabled>Marca</option><option>Audi</option><option>BMW</option><option>Mercedes-Benz</option><option>Volkswagen</option><option>Volvo</option><option>Toyota</option></select><input placeholder="Modelo ou palavra-chave"/><select defaultValue=""><option value="" disabled>Preço máximo</option><option>CHF 2'500</option><option>CHF 5'000</option><option>CHF 10'000</option><option>CHF 25'000</option></select><button>Pesquisar</button></div>
   <div className="quick"><span>🔥 Até CHF 2'500</span><span>✓ Com MFK</span><span>⚡ Recém-anunciados</span></div><a className="diagnosticHero" href="/diagnostico"><b>🔧 Encontre o diagnóstico do seu carro aqui</b><small>Descreva o problema e receba uma análise inteligente →</small></a></div>
   <div className="carCard"><div className="car">🚘</div><b>Encontre. Compare. Dirija.</b><small>Total Cars Switzerland</small></div></section>
   <section className="section" id="categorias"><p className="eyebrow">EXPLORE</p><h2>Tudo para quem gosta de carros</h2><div className="grid">{categories.map(([i,t,d])=><article key={t}><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p><a href="#">Explorar →</a></article>)}</div></section>
   <section className="cta" id="eventos"><div><p className="eyebrow">PARA VENDEDORES</p><h2>Tem um carro para vender?</h2><p>Crie seu anúncio e alcance compradores em toda a Suíça.</p></div><button>Anunciar meu carro</button></section>
   <footer><div className="brand">TOTAL <b>CARS</b><span>.CH</span></div><p>O portal automotivo feito para a Suíça.</p><small>© 2026 Total Cars Switzerland</small></footer>
 </main>
}