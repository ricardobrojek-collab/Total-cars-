import { buildMagazine } from "../../../lib/revista";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await buildMagazine();
    return Response.json(data, {
      headers: {
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=7200"
      }
    });
  } catch (error) {
    console.error("revista api", error);
    return Response.json(
      { articles: [], error: "Não foi possível atualizar a revista agora." },
      { status: 500 }
    );
  }
}
