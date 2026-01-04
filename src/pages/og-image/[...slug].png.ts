import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { SITE } from "@consts";
import { getCollection } from "astro:content";
import { formatDateLong } from "@lib/utils";

const fontFile = await fetch(
    "https://cdn.jsdelivr.net/npm/@fontsource/geist/files/geist-latin-400-normal.woff",
);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();
const ogOptions: SatoriOptions = {
	fonts: [
		{
			data: fontData,
			name: "Geist",
			style: "normal",
			weight: 400,
		},
		{
			data: fontData,
			name: "Geist",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

const markup = (title: string, date: string, description: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
        <div tw="flex flex-col flex-1 w-full p-10 justify-center">
            <h1 tw="text-4xl font-bold text-white">${title}</h1>
            <p tw="mt-0 text-2xl">${description}</p>
        </div>

        <div tw="flex justify-between w-full p-10 text-xl">
            <p>${date}</p>
            <p tw="font-semibold">by ${SITE.AUTHOR}</p>
        </div>
    </div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { date, title, description } = context.props as Props;

	const postDate = formatDateLong(date);
	const svg = await satori(markup(title, postDate, description), ogOptions);
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
	return posts
		.map((post) => ({
			params: { slug: post.id },
			props: {
				title: post.data.title,
                date: post.data.date,
                description: post.data.description,
			},
		}));
}
