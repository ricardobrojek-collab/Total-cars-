import { unstable_cache } from "next/cache";

const FEEDS = [
  { url: "https://carnewschina.com/feed/", sourceName: "CarNewsChina", region: "CHINA" },
  { url: "https://www.motor1.com/rss/articles/all/", sourceName: "Motor1", region: "MUNDO" },
  { url: "https://insideevs.com/rss/articles/all/", sourceName: "InsideEVs", region: "ELÉTRICOS" },
  { url: "https://www.carscoops.com/feed/", sourceName: "Carscoops", region: "MUNDO" },
  { url: "https://www.autocar.co.uk/rss", sourceName: "Autocar", region: "EUROPA" },
  { url: "https://www.topgear.com/rss", sourceName: "Top Gear", region: "EUROPA" },
  { url: "https://electrek.co/feed/", sourceName: "Electrek", region: "TECNOLOGIA" }
];

function decode(value = "") {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&#038;/g, "&")
    .trim();
}

function strip(value = "") {
  return decode(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp("<" + name + "[^>]*>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return match ? strip(match[1]) : "";
}

function rawTag(block, name) {
  const match = block.match(new RegExp("<" + name + "[^>]*>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return match ? decode(match[1]) : "";
}

function extractImage(block) {
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\//i,
    /<enclosure[^>]+type=["']image\/[^"']*["'][^>]+url=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i
  ];
  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match?.[1] && /^https?:\/\//i.test(decode(match[1]))) return decode(match[1]);
  }
  return "";
}

function parseFeed(xml, meta) {
  return [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)]
    .slice(0, 9)
    .map((match, index) => {
      const block = match[0];
      const title = tag(block, "title");
      const sourceUrl = tag(block, "link") || tag(block, "guid");
      const descriptionRaw = rawTag(block, "description") || rawTag(block, "content:encoded");
      const body = strip(descriptionRaw);
      const date = tag(block, "pubDate") || tag(block, "dc:date");
      const imageUrl = extractImage(block + descriptionRaw);
      return {
        id: meta.sourceName.toLowerCase().replace(/\W+/g, "-") + "-" + index,
        title,
        sourceUrl,
        description: body.slice(0, 520),
        date,
        imageUrl,
        sourceName: meta.sourceName,
        region: meta.region
      };
    })
    .filter(item => item.title && /^https?:\/\//i.test(item.sourceUrl));
}

function inferCategory(text = "", region = "") {
  const t = text.toLowerCase();
  if (region === "CHINA" || /byd|xiaomi|geely|zeekr|nio|xpeng|leapmotor|chery|china|chinese/.test(t)) return "CHINA";
  if (/battery|bateria|charging|charge|electric|ev\b|range|autonomia/.test(t)) return "ELÉTRICOS";
  if (/concept|prototype|future|futuro|patent|render|spy|scoop/.test(t)) return "FUTURO";
  if (/supercar|hypercar|ferrari|lamborghini|mclaren|bugatti|porsche/.test(t)) return "SUPERCARROS";
  if (/price|pricing|sales|market|vendas|preço|industry|factory|production/.test(t)) return "MERCADO";
  if (/review|test drive|first drive|comparison|comparativo|teste/.test(t)) return "TESTES";
  if (/technology|software|autonomous|ai\b|robotaxi|tech/.test(t)) return "TECNOLOGIA";
  if (/classic|heritage|history|retro|vintage/.test(t)) return "CLÁSSICOS";
  if (/weird|strange|crazy|odd|record|curious|curios/.test(t)) return "CURIOSIDADES";
  return region === "EUROPA" ? "EUROPA" : "LANÇAMENTOS";
}

function interleave(groups, limit = 32) {
  const output = [];
  const max = Math.max(0, ...groups.map(group => group.length));
  for (let i = 0; i < max && output.length < limit; i++) {
    for (const group of groups) {
      if (group[i] && output.length < limit) output.push(group[i]);
    }
  }
  return output;
}

function directEdition(source) {
  return source.slice(0, 24).map(item => ({
    ...item,
    category: inferCategory(item.title + " " + item.description, item.region),
    sub: item.description ? item.description.slice(0, 150) : "Notícia automotiva internacional em destaque.",
    body: item.description || "Abra a fonte original para conferir todos os detalhes desta notícia.",
    hook: "Radar Total Cars: acompanhe a fonte original para os dados completos."
  }));
}

async function generateEditorial(source, key) {
  const input = source.slice(0, 28).map((item, index) => ({
    id: index,
    title: item.title,
    description: item.description.slice(0, 360),
    source: item.sourceName,
    region: item.region
  }));

  const prompt = `Você é o editor-chefe da Revista Total Cars, uma revista automotiva internacional em português brasileiro.

Crie uma edição dinâmica, moderna e variada usando SOMENTE os fatos dos itens fornecidos. Não invente números, versões, datas, preços, potência, autonomia, falas ou conclusões.

Objetivo editorial:
- parecer uma revista automotiva grande, não uma lista de links;
- misturar China, Europa, elétricos, tecnologia, lançamentos, mercado, supercarros, testes, futuro, clássicos e curiosidades;
- escolher ângulos interessantes e explicar por que cada assunto chama atenção;
- evitar repetir o mesmo fabricante em sequência;
- priorizar variedade geográfica e assuntos surpreendentes.

Retorne JSON puro: um array de 18 a 22 objetos.
Cada objeto deve conter EXATAMENTE:
id (número do item original),
title (título editorial curto e forte em PT-BR),
sub (1 frase de apoio),
body (80 a 135 palavras, original, factual e fácil de ler),
category (uma destas: CHINA, EUROPA, ELÉTRICOS, TECNOLOGIA, LANÇAMENTOS, FUTURO, MERCADO, TESTES, SUPERCARROS, CLÁSSICOS, CURIOSIDADES),
hook (uma frase curta começando por "Por que importa:" ou "O detalhe curioso:").

Não inclua URLs no JSON e não copie frases longas das fontes.

ITENS:
${JSON.stringify(input)}`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: 6500,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) throw new Error("Gemini editorial request failed");
  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("") || "[]";
  const generated = JSON.parse(raw);
  const array = Array.isArray(generated) ? generated : generated.articles || [];

  const used = new Set();
  return array
    .map(article => {
      const index = Number(article.id);
      const original = source[index];
      if (!original || used.has(index)) return null;
      used.add(index);
      return {
        ...original,
        title: strip(String(article.title || original.title)).slice(0, 150),
        sub: strip(String(article.sub || original.description)).slice(0, 210),
        body: strip(String(article.body || original.description)).slice(0, 1300),
        category: strip(String(article.category || inferCategory(original.title, original.region))).toUpperCase(),
        hook: strip(String(article.hook || "")).slice(0, 240)
      };
    })
    .filter(Boolean);
}

async function buildMagazineFresh() {
  const batches = await Promise.allSettled(
    FEEDS.map(async meta => {
      const response = await fetch(meta.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; TotalCarsCH/1.0; +https://totalcars.ch)"
        },
        next: { revalidate: 1800 }
      });
      if (!response.ok) throw new Error(meta.sourceName + " feed unavailable");
      return parseFeed(await response.text(), meta);
    })
  );

  const groups = batches
    .filter(batch => batch.status === "fulfilled")
    .map(batch => batch.value)
    .filter(Boolean);

  let source = interleave(groups, 32);
  const seen = new Set();
  source = source.filter(item => {
    const key = item.sourceUrl || item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (!source.length) {
    return {
      articles: [],
      updatedAt: new Date().toISOString(),
      sourceCount: 0,
      status: "sources-unavailable"
    };
  }

  let articles = directEdition(source);
  const key = process.env.GEMINI_API_KEY;

  if (key) {
    try {
      const generated = await generateEditorial(source, key);
      if (generated.length >= 8) articles = generated;
    } catch (error) {
      console.error("revista editorial", error);
    }
  }

  return {
    articles,
    updatedAt: new Date().toISOString(),
    sourceCount: groups.length,
    status: key ? "editorial-ai" : "direct-feed"
  };
}

export const buildMagazine = unstable_cache(
  buildMagazineFresh,
  ["totalcars-revista-world-v4"],
  { revalidate: 1800 }
);
