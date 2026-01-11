import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { SITE } from "@consts";
import { getOgTemplateNoDate, getOgOptions } from "./og-template";

export async function GET() {
  const svg = await satori(await getOgTemplateNoDate(SITE.TITLE, SITE.DESCRIPTION), await getOgOptions());
  const pngBuffer = new Resvg(svg).render().asPng();
  const png = new Uint8Array(pngBuffer);
  return new Response(png, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}
