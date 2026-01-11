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
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const bookmarks = await getCollection("bookmarks");
  const prompts = await getCollection("prompts", ({ data }) => !data.draft);
  const videos = await getCollection("videos", ({ data }) => !data.draft);

  const tags = [
    ...new Set([
      ...posts.flatMap((post) => post.data.tags || []),
      ...bookmarks.flatMap((bookmark) => bookmark.data.tags || []),
      ...prompts.flatMap((prompt) => prompt.data.tags || []),
      ...videos.flatMap((video) => video.data.tags || []),
    ]),
  ].sort();

  return tags.map((tag) => ({
    params: { id: tag },
    props: {
      title: `#${tag}`,
      description: "Tagged content"
    },
  }));
}
