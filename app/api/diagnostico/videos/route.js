export const runtime="nodejs";
export async function GET(req){
 const q=new URL(req.url).searchParams.get("q")?.slice(0,150)||"";
 const searchUrl="https://www.youtube.com/results?search_query="+encodeURIComponent(q);
 const key=process.env.YOUTUBE_API_KEY;
 if(!q||!key)return Response.json({videos:[],searchUrl});
 try{const u=new URL("https://www.googleapis.com/youtube/v3/search");u.search=new URLSearchParams({part:"snippet",type:"video",maxResults:"3",videoEmbeddable:"true",safeSearch:"strict",q,key}).toString();const r=await fetch(u,{signal:AbortSignal.timeout(8000)});const d=await r.json();if(!r.ok)return Response.json({videos:[],searchUrl});return Response.json({searchUrl,videos:(d.items||[]).map(i=>({id:i.id.videoId,title:i.snippet.title,channel:i.snippet.channelTitle}))})}catch{return Response.json({videos:[],searchUrl})}
}