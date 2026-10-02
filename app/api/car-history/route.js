import { NextResponse } from "next/server";

function safeQuery(value = "") {
  return value.trim().slice(0, 60).replace(/[\\"]/g, " ");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = safeQuery(searchParams.get("q") || "Porsche");
  if (q.length < 2) return NextResponse.json({success:false,cars:[],error:"Digite pelo menos 2 caracteres."},{status:400});

  const sparql = `
SELECT DISTINCT ?car ?carLabel ?image ?inception WHERE {
  ?car wdt:P31/wdt:P279* wd:Q1420;
       rdfs:label ?label;
       wdt:P18 ?image.
  FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${q}")))
  FILTER(LANG(?label) IN ("pt","en","de","fr","it"))
  OPTIONAL { ?car wdt:P571 ?inception. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en,de,fr,it". }
}
LIMIT 16`;
  const endpoint="https://query.wikidata.org/sparql?query="+encodeURIComponent(sparql)+"&format=json";
  try {
    const response=await fetch(endpoint,{headers:{"User-Agent":"TotalCarsSwitzerland/1.0 (info@totalcars.ch)","Accept":"application/sparql-results+json"},next:{revalidate:86400}});
    if(!response.ok) throw new Error("Wikidata "+response.status);
    const data=await response.json();
    const seen=new Set();
    const cars=(data?.results?.bindings||[]).map(item=>{
      const name=item?.carLabel?.value||"Veículo";
      const imageUrl=(item?.image?.value||"").replace("http://","https://");
      const year=item?.inception?.value ? String(new Date(item.inception.value).getUTCFullYear()) : "";
      return {id:item?.car?.value||name,name,year,imageUrl};
    }).filter(x=>x.imageUrl&&!seen.has(x.id)&&(seen.add(x.id),true));
    return NextResponse.json({success:true,query:q,count:cars.length,cars});
  } catch(error) {
    console.error("car-history",error);
    return NextResponse.json({success:false,cars:[],error:"O acervo externo está indisponível no momento."},{status:502});
  }
}