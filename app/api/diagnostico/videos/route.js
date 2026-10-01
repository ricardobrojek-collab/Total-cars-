export const runtime="nodejs";
export async function GET(req){
 const p=new URL(req.url).searchParams,q=(p.get("q")||"").slice(0,180);
 const searchUrl="https://www.youtube.com/results?search_query="+encodeURIComponent(q+" diagnóstico automotivo");
 const key=process.env.YOUTUBE_API_KEY;
 if(!q||!key)return Response.json({configured:Boolean(key),videos:[],searchUrl});
 try{
  const u=new URL("https://www.googleapis.com/youtube/v3/search");
  u.search=new URLSearchParams({part:"snippet",type:"video",maxResults:"4",videoEmbeddable:"true",safeSearch:"strict",q:q+" diagnóstico automotivo",key}).toString();
  const r=await fetch(u,{signal:AbortSignal.timeout(8000)}),d=await r.json();
  if(!r.ok)return Response.json({configured:true,videos:[],searchUrl});
  return Response.json({configured:true,searchUrl,videos:(d.items||[]).map(i=>({id:i.id.videoId,title:i.snippet.title,channel:i.snippet.channelTitle,publishedAt:i.snippet.publishedAt,thumbnail:i.snippet.thumbnails?.medium?.url||i.snippet.thumbnails?.default?.url,embedUrl:"https://www.youtube-nocookie.com/embed/"+i.id.videoId+"?rel=0&modestbranding=1"}))});
 }catch{return Response.json({configured:true,videos:[],searchUrl})}
}