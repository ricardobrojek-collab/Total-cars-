const categories = [
  ["🚗","Marketplace","Carros novos e usados em toda a Suíça","/marketplace"],
  ["🔧","Peças","Peças novas, usadas e fornecedores","/pecas"],
  ["🛞","Rodas e pneus","Pneus, rodas e conjuntos completos","/pneus"],
  ["🏁","Oficinas","Mecânicas, carrocerias e especialistas","/oficinas"],
  ["♻️","Desmanches","Auto-recycling e peças usadas","/desmanches"],
  ["📅","Eventos","Encontros e eventos automotivos","/eventos"],
  ["📰","Revista","Notícias, lançamentos e guias","/revista"],
  ["📚","Ficha técnica","Marcas, modelos e especificações","/fichas"],
  ["▶️","Vídeos","Tutoriais, reviews e diagnóstico por idioma","/videos"],
  ["📱","Apps","Aplicativos úteis para motoristas","/apps"],
  ["❤️","Minha garagem","Favoritos, veículos e diagnósticos","/garagem"]
];

const highlights = [
  ["Busca inteligente","Pesquise por marca, modelo, preço, MFK, combustível e região."],
  ["Diagnóstico do carro","Descreva barulho, falha ou sintoma e veja causas possíveis."],
  ["Tudo em um só lugar","Carros, peças, pneus, oficinas, eventos e conteúdo automotivo."]
];

export default function Home() {
  return <main>
    <header className="top">
      <a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a>
      <nav>
        <a href="/marketplace">Comprar</a>
        <a href="/diagnostico">Diagnóstico IA</a>
        <a href="/pecas">Peças</a>
        <a href="/oficinas">Oficinas</a>
        <a href="/revista">Revista</a>
        <a href="/fichas">Ficha técnica</a>
        <a href="/eventos">Eventos</a>
        <a className="navButton" href="/anunciar">ANUNCIAR GRÁTIS</a>
      </nav>
    </header>

    <section className="hero" id="buscar">
      <div className="heroText">
        <p className="eyebrow">SUÍÇA • EUROPA • MUNDO AUTOMOTIVO</p>
        <h1>Seu carro. Seu mundo. Tudo em um só lugar.</h1>
        <p>Compre, venda ou troque carros, encontre peças e oficinas, descubra eventos, consulte fichas técnicas e investigue defeitos com o Diagnóstico Total Cars.</p>

        <div className="search">
          <select defaultValue="">
            <option value="" disabled>Marca</option>
            <option>Audi</option><option>BMW</option><option>Mercedes-Benz</option>
            <option>Volkswagen</option><option>Volvo</option><option>Toyota</option>
          </select>
          <input placeholder="Modelo, peça ou palavra-chave"/>
          <select defaultValue="">
            <option value="" disabled>Preço máximo</option>
            <option>CHF 2'500</option><option>CHF 5'000</option>
            <option>CHF 10'000</option><option>CHF 25'000</option>
          </select>
          <button>Pesquisar</button>
        </div>

        <div className="quick">
          <span>🔥 Até CHF 2'500</span>
          <span>✓ Com MFK</span>
          <span>⚡ Recém-anunciados</span>
          <span>🔁 Aceita troca</span>
        </div>

        <a className="diagnosticHero" href="/diagnostico">
          <b>🔧 Encontre o diagnóstico do seu carro aqui</b>
          <small>Descreva o problema e receba uma análise inteligente →</small>
        </a>
      </div>

      <div className="carCard">
        <div className="car">🏎️</div>
        <b>COMPRE • VENDA • TROQUE</b>
        <small>Total Cars Switzerland</small>
      </div>
    </section>

    <section className="trustStrip">
      {highlights.map(([t,d]) => <div key={t}><b>{t}</b><span>{d}</span></div>)}
    </section>

    <section className="section" id="categorias">
      <p className="eyebrow">EXPLORE</p>
      <h2>Tudo para quem gosta de carros</h2>
      <div className="grid">
        {categories.map(([i,t,d,href]) => <article key={t}>
          <div className="icon">{i}</div>
          <h3>{t}</h3>
          <p>{d}</p>
          <a href={href}>Explorar →</a>
        </article>)}
      </div>
    </section>

    <section className="featureBand">
      <div>
        <p className="eyebrow">NOVIDADE</p>
        <h2>Diagnóstico inteligente para problemas do carro</h2>
        <p>Barulho na partida? Suspensão estalando? Ventoinha ligada? Descreva o sintoma e receba hipóteses, testes simples e próximos passos.</p>
        <a className="buttonLink" href="/diagnostico">Testar diagnóstico</a>
      </div>
      <div className="featureVisual">🧠🔧🚗</div>
    </section>

    <section className="section">
      <p className="eyebrow">CONTEÚDO</p>
      <h2>Revista, lançamentos e ficha técnica</h2>
      <div className="editorialGrid">
        <a href="/revista" className="editorialCard">
          <span>REVISTA TOTAL CARS</span>
          <h3>Uma revista automotiva realmente global</h3>
          <p>Europa, China, Japão, EUA e novas marcas: lançamentos, supercarros, elétricos, tecnologia, indústria, clássicos, preparação e mercado.</p>
        </a>
        <a href="/fichas" className="editorialCard">
          <span>BASE TÉCNICA</span>
          <h3>Enciclopédia técnica de carros por marca e modelo</h3>
          <p>Marca → modelo → geração → motor → versão, com potência, torque, consumo, transmissão, dimensões, desempenho e dados técnicos.</p>
        </a>
      </div>
    </section>

    <section className="cta">
      <div>
        <p className="eyebrow">PARA VENDEDORES</p>
        <h2>Tem um carro para vender?</h2>
        <p>Crie seu anúncio e alcance compradores em toda a Suíça.</p>
      </div>
      <a className="buttonLink" href="/anunciar">Anunciar meu carro</a>
    </section>

    <footer>
      <div className="brand">TOTAL <b>CARS</b><span>.CH</span></div>
      <p>O portal automotivo feito para a Suíça.</p>
      <small>© 2026 Total Cars Switzerland</small>
    </footer>
  </main>
}