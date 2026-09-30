const sections=[
["🚀 Lançamentos","Novidades e estreias de marcas europeias, americanas, japonesas, coreanas e chinesas."],
["🇨🇳 China","BYD, Geely, Zeekr, NIO, XPeng e o mercado que mais acelera em novas tecnologias."],
["⚡ Elétricos & híbridos","Baterias, autonomia, carregamento, novos motores e comparativos."],
["🏎️ Esportivos & supercarros","Ferrari, Lamborghini, Porsche, McLaren e máquinas de alta performance."],
["🇨🇭 Mercado suíço","MFK, usados, preços, mobilidade, pneus e assuntos úteis para motoristas na Suíça."],
["🔧 Oficina & tecnologia","Motores, manutenção, diagnóstico, segurança, ADAS e novas soluções."],
["🕰️ Clássicos","Histórias, modelos marcantes, colecionáveis e restauração."],
["🏭 Indústria","Fábricas, novos grupos, plataformas, motores e movimentos do setor."],
["🎯 Guias de compra","O que verificar, custos, versões, problemas conhecidos e comparações."],
["🌍 Mundo","Europa, América, Ásia, Oriente Médio e os fatos automotivos mais relevantes."]
];
export default function Page(){return <main className="simplePage"><header className="top"><a className="brand brandLink" href="/">TOTAL <b>CARS</b><span>.CH</span></a><nav><a href="/fichas">Fichas</a><a href="/videos">Vídeos</a><a href="/">← Início</a></nav></header><section className="simpleHero"><p className="eyebrow">REVISTA TOTAL CARS • GLOBAL</p><h1>O mundo dos carros não termina na Europa</h1><p>Uma central editorial organizada para lançamentos, tecnologia, indústria, esportivos, clássicos e mercado suíço. As matérias automáticas precisam de fontes/APIs licenciadas antes de serem publicadas como notícias reais.</p></section><section className="cardsList">{sections.map(([t,d])=><article className="infoCard" key={t}><h3>{t}</h3><p>{d}</p><a href={"/revista?tema="+encodeURIComponent(t)}>Ver matérias →</a></article>)}</section></main>}