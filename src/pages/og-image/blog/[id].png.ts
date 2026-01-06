import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori from "satori";
import { getCollection } from "astro:content";
import { formatDateLong } from "@lib/utils";
import { getOgTemplateWithDate, getOgOptions } from "../og-template";
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { date, title, description } = context.props as Props;
  const postDate = formatDateLong(date);
  const svg = await satori(await getOgTemplateWithDate(title, postDate, description), await getOgOptions());
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
  const posts = await getCollection("blog");
  return posts.map((post) => {
    return {
        params: { id: post.id },
        props: {
          title: post.data.title,
          date: post.data.date,
          description: post.data.description
        }
    }
  });
}
