const categories=[
["🚘","Comprar carros","Novos, usados, clássicos e oportunidades","/marketplace"],
["🔁","Trocar veículo","Encontre anúncios que aceitam troca","/marketplace"],
["🧠","Diagnóstico IA","Investigue barulhos, falhas e sintomas","/diagnostico"],
["⚙️","Peças","Novas, usadas e fornecedores suíços","/pecas"],
["🛞","Pneus & rodas","Lojas, ofertas e serviços","/pneus"],
["🔧","Oficinas","Mecânicas, especialistas e carrocerias","/oficinas"],
["♻️","Desmanches","Auto-recycling e peças usadas","/desmanches"],
["🏁","Eventos","Encontros e eventos automotivos","/eventos"]
];
const news=[
["REVISTA","Mundo automotivo sem fronteiras","Europa, China, Japão, EUA, lançamentos, tecnologia e mercado.","/revista"],
["FICHA TÉCNICA","Descubra qualquer carro","Marca, modelo, geração, motor, potência, consumo e dimensões.","/fichas"],
["VÍDEOS","Aprenda e descubra","Reviews, manutenção, diagnóstico e conteúdo no seu idioma.","/videos"]
];
export default function Home(){return <main className="tc">
<header className="premiumTop"><a className="premiumLogo" href="/"><span>TOTAL</span> CARS<em>.CH</em></a><nav><a href="/marketplace">CARROS</a><a href="/pecas">PEÇAS</a><a href="/oficinas">OFICINAS</a><a href="/revista">REVISTA</a><a href="/fichas">FICHAS</a><a href="/eventos">EVENTOS</a></nav><div className="topActions"><a href="/garagem">♡ GARAGEM</a><a className="sellBtn" href="/anunciar">+ ANUNCIAR</a></div></header>
<section className="premiumHero"><div className="heroShade"></div><div className="premiumHeroContent"><span className="heroKicker">TOTAL CARS SWITZERLAND</span><h1>O MUNDO DO<br/><i>AUTOMÓVEL</i><br/>EM UM SÓ LUGAR.</h1><p>Comprar. Vender. Trocar. Descobrir. Resolver.</p><div className="premiumSearch"><select defaultValue=""><option value="" disabled>Marca</option><option>Audi</option><option>BMW</option><option>Mercedes-Benz</option><option>Porsche</option><option>Volkswagen</option><option>Toyota</option></select><input placeholder="Modelo ou palavra-chave"/><select defaultValue=""><option value="" disabled>Preço até</option><option>CHF 5'000</option><option>CHF 10'000</option><option>CHF 25'000</option><option>CHF 50'000+</option></select><a href="/marketplace">BUSCAR</a></div><div className="heroLinks"><a href="/marketplace">🔥 Ofertas</a><a href="/marketplace">✓ Com MFK</a><a href="/marketplace">↔ Aceita troca</a></div></div><a className="aiFloat" href="/diagnostico"><span>AI</span><div><b>DIAGNÓSTICO TOTAL CARS</b><small>Conte o problema do seu carro →</small></div></a></section>
<section className="darkStats"><div><strong>01</strong><span>CARROS<br/>Marketplace suíço</span></div><div><strong>02</strong><span>GARAGEM<br/>Serviços e peças</span></div><div><strong>03</strong><span>CONTEÚDO<br/>Revista global</span></div><div><strong>04</strong><span>INTELIGÊNCIA<br/>Diagnóstico IA</span></div></section>
<section className="premiumSection"><div className="sectionHead"><div><span>EXPLORE TOTAL CARS</span><h2>Tudo que seu carro precisa.</h2></div><a href="/marketplace">VER MARKETPLACE →</a></div><div className="premiumGrid">{categories.map(([i,t,d,h],n)=><a href={h} className={"premiumTile tile"+n} key={t}><span className="tileNo">0{n+1}</span><div className="tileIcon">{i}</div><h3>{t}</h3><p>{d}</p><b>EXPLORAR →</b></a>)}</div></section>
<section className="aiBand"><div><span className="heroKicker">TOTAL CARS INTELLIGENCE</span><h2>Seu carro fala.<br/>A gente ajuda você a entender.</h2><p>Descreva o barulho, falha ou comportamento. Organize possibilidades, verificações iniciais e encontre conteúdo relacionado.</p><a href="/diagnostico">ABRIR DIAGNÓSTICO →</a></div><div className="aiOrb"><span>TC</span><b>AI</b></div></section>
<section className="premiumSection editorial"><div className="sectionHead"><div><span>TOTAL CARS MEDIA</span><h2>Mais que classificados.</h2></div></div><div className="newsGrid">{news.map(([k,t,d,h],n)=><a href={h} key={t} className={"newsCard news"+n}><small>{k}</small><h3>{t}</h3><p>{d}</p><b>DESCOBRIR →</b></a>)}</div></section>
<section className="sellBand"><div><small>VENDA SEU CARRO</small><h2>Seu próximo negócio começa aqui.</h2><p>Anuncie para compradores em toda a Suíça.</p></div><a href="/anunciar">ANUNCIAR GRÁTIS →</a></section>
<footer className="premiumFooter"><div className="premiumLogo"><span>TOTAL</span> CARS<em>.CH</em></div><div>Marketplace · Peças · Oficinas · Revista · Fichas · Eventos</div><small>© 2026 Total Cars Switzerland</small></footer>
</main>}