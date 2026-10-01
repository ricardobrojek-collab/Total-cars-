import MagazineClient from "./MagazineClient";
import { buildMagazine } from "../../lib/revista";

export const revalidate = 1800;

export const metadata = {
  title: "Revista Total Cars | Notícias automotivas do mundo",
  description: "China, Europa, elétricos, tecnologia, lançamentos, mercado, testes, curiosidades e supercarros em uma revista automotiva global."
};

export default async function RevistaPage() {
  let initialData = { articles: [], sourceCount: 0, updatedAt: new Date().toISOString() };

  try {
    initialData = await buildMagazine();
  } catch (error) {
    console.error("revista page", error);
  }

  return <MagazineClient initialData={initialData} />;
}
