import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori from "satori";
import { getCollection } from "astro:content";
import { getOgTemplateNoDate, getOgOptions } from "../og-template";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { title, description } = context.props as Props;
  const svg = await satori(await getOgTemplateNoDate(title, description), await getOgOptions());
  const pngBuffer = new Resvg(svg).render().asPng();
  const png = new Uint8Array(pngBuffer);
  return new Response(png, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const videos = await getCollection("videos", ({ data }) => !data.draft);
  return videos.map((video) => ({
    params: { id: video.id },
    props: {
      title: video.data.title,
      description: 'Video'
    },
  }));
}
