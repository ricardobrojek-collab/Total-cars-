"use client";

import { useMemo, useState } from "react";
import styles from "./revista.module.css";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function CoverImage({ article, className = "" }) {
  if (!article?.imageUrl) {
    return (
      <div className={styles.noImage + " " + className}>
        <span>{article?.region || article?.category || "TOTAL CARS"}</span>
        <strong>{article?.sourceName || "RADAR MUNDIAL"}</strong>
      </div>
    );
  }

  return (
    <div className={styles.imageWrap + " " + className}>
      <img
        src={article.imageUrl}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={event => {
          event.currentTarget.style.display = "none";
          event.currentTarget.parentElement?.classList.add(styles.imageFailed);
        }}
      />
      <span className={styles.imageFallback}>{article.region || article.category || "TOTAL CARS"}</span>
    </div>
  );
}

function Meta({ article }) {
  return (
    <div className={styles.meta}>
      <b>{article.category || "ATUALIDADE"}</b>
      <span>{article.region || "MUNDO"}</span>
      <span>{article.sourceName}</span>
      {article.date ? <span>{formatDate(article.date)}</span> : null}
    </div>
  );
}

function StoryCard({ article, onOpen, compact = false }) {
  return (
    <article className={compact ? styles.compactCard : styles.storyCard}>
      <button type="button" className={styles.cardButton} onClick={() => onOpen(article)}>
        <CoverImage article={article} className={compact ? styles.compactImage : styles.cardImage} />
        <div className={styles.cardCopy}>
          <Meta article={article} />
          <h3>{article.title}</h3>
          {!compact ? <p>{article.sub}</p> : null}
          {article.hook && !compact ? <strong className={styles.hook}>{article.hook}</strong> : null}
        </div>
      </button>
    </article>
  );
}

export default function MagazineClient({ initialData }) {
  const articles = initialData?.articles || [];
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("TODAS");

  const categories = useMemo(() => {
    const values = [...new Set(articles.map(article => article.category).filter(Boolean))];
    return ["TODAS", ...values.slice(0, 10)];
  }, [articles]);

  const filtered = filter === "TODAS"
    ? articles
    : articles.filter(article => article.category === filter);

  const hero = filtered[0] || articles[0];
  const side = filtered.slice(1, 5);
  const china = articles.filter(article => article.region === "CHINA" || article.category === "CHINA").slice(0, 6);
  const tech = articles.filter(article => ["TECNOLOGIA", "ELÉTRICOS", "FUTURO"].includes(article.category)).slice(0, 6);
  const curious = articles.filter(article => ["CURIOSIDADES", "CLÁSSICOS", "SUPERCARROS"].includes(article.category)).slice(0, 6);
  const radar = filtered.slice(hero ? 5 : 0);

  if (!articles.length) {
    return (
      <main className={styles.page}>
        <header className={styles.topbar}>
          <a href="/" className={styles.logo}><span>TOTAL</span> CARS<em>.CH</em></a>
        </header>
        <section className={styles.empty}>
          <b>REVISTA TOTAL CARS</b>
          <h1>O radar mundial está atualizando.</h1>
          <p>A estrutura da revista está pronta; as fontes externas não responderam nesta atualização.</p>
          <a href="/">Voltar ao Total Cars</a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a href="/" className={styles.logo}><span>TOTAL</span> CARS<em>.CH</em></a>
        <div className={styles.issue}>
          <b>REVISTA GLOBAL</b>
          <span>{initialData?.updatedAt ? "Atualizada " + formatDate(initialData.updatedAt) : "Edição atual"}</span>
          <span>{initialData?.sourceCount || 0} fontes internacionais</span>
        </div>
      </header>

      <section className={styles.ticker}>
        <b>AGORA</b>
        <div>
          {articles.slice(0, 7).map((article, index) => (
            <span key={article.sourceUrl || index}>{article.title}</span>
          ))}
        </div>
      </section>

      <nav className={styles.filters} aria-label="Categorias da revista">
        {categories.map(category => (
          <button
            type="button"
            key={category}
            className={filter === category ? styles.activeFilter : ""}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      {hero ? (
        <section className={styles.leadGrid}>
          <button type="button" className={styles.hero} onClick={() => setActive(hero)}>
            <CoverImage article={hero} className={styles.heroImage} />
            <div className={styles.heroShade} />
            <div className={styles.heroCopy}>
              <Meta article={hero} />
              <h1>{hero.title}</h1>
              <p>{hero.sub}</p>
              {hero.hook ? <strong>{hero.hook}</strong> : null}
              <span className={styles.read}>LER MATÉRIA →</span>
            </div>
          </button>

          <div className={styles.sideGrid}>
            {side.map(article => (
              <StoryCard key={article.sourceUrl} article={article} onOpen={setActive} compact />
            ))}
          </div>
        </section>
      ) : null}

      {china.length ? (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <div>
              <span>🇨🇳 ESPECIAL</span>
              <h2>China em movimento</h2>
            </div>
            <p>Marcas, baterias, preços, tecnologia e carros que podem mudar o mercado europeu.</p>
          </div>
          <div className={styles.cardGrid}>
            {china.map(article => (
              <StoryCard key={article.sourceUrl} article={article} onOpen={setActive} />
            ))}
          </div>
        </section>
      ) : null}

      {tech.length ? (
        <section className={styles.section + " " + styles.darkSection}>
          <div className={styles.sectionTitle}>
            <div>
              <span>AMANHÃ JÁ COMEÇOU</span>
              <h2>Tecnologia, elétricos e futuro</h2>
            </div>
            <p>Baterias, IA, carregamento, autonomia, software e conceitos que estão saindo do laboratório.</p>
          </div>
          <div className={styles.cardGrid}>
            {tech.map(article => (
              <StoryCard key={article.sourceUrl} article={article} onOpen={setActive} />
            ))}
          </div>
        </section>
      ) : null}

      {curious.length ? (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <div>
              <span>FORA DA CAIXINHA</span>
              <h2>Coisas que você não esperava ver num site de carros</h2>
            </div>
            <p>Clássicos, recordes, supercarros, projetos estranhos e histórias automotivas que merecem ser descobertas.</p>
          </div>
          <div className={styles.cardGrid}>
            {curious.map(article => (
              <StoryCard key={article.sourceUrl} article={article} onOpen={setActive} />
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <div>
            <span>PLANETA AUTO</span>
            <h2>Radar mundial</h2>
          </div>
          <p>A revista continua abaixo: lançamentos, indústria, testes, Europa, China e o que está chamando atenção no mundo.</p>
        </div>
        <div className={styles.cardGrid}>
          {radar.map(article => (
            <StoryCard key={article.sourceUrl} article={article} onOpen={setActive} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <a href="/">TOTAL CARS.CH</a>
        <span>Notícias reescritas em linguagem editorial própria a partir de fontes identificadas. Clique na fonte original para conferência.</span>
      </footer>

      {active ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setActive(null)}>
          <article className={styles.modal} role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
            <button type="button" className={styles.close} onClick={() => setActive(null)} aria-label="Fechar">×</button>
            <CoverImage article={active} className={styles.modalImage} />
            <div className={styles.modalCopy}>
              <Meta article={active} />
              <h2>{active.title}</h2>
              <h3>{active.sub}</h3>
              <p>{active.body}</p>
              {active.hook ? <strong className={styles.modalHook}>{active.hook}</strong> : null}
              <div className={styles.sourceBox}>
                <span>Fonte: {active.sourceName}</span>
                <a href={active.sourceUrl} target="_blank" rel="noreferrer">VER PUBLICAÇÃO ORIGINAL ↗</a>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
