import { SITE } from "@consts";
import { html } from "satori-html";
import { type SatoriOptions } from "satori";

let geistFontPromise: Promise<ArrayBuffer> | undefined;

async function loadGeist400() {
  if (!geistFontPromise) {
    geistFontPromise = fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/geist/files/geist-latin-400-normal.woff"
    ).then((r) => r.arrayBuffer());
  }
  return geistFontPromise;
}

export async function getOgOptions(): Promise<SatoriOptions> {
  const fontData = await loadGeist400();

  return {
    fonts: [
      { data: fontData, name: "Geist", style: "normal", weight: 400 },
      { data: fontData, name: "Geist", style: "normal", weight: 700 },
    ],
    width: 1200,
    height: 630,
  };
}

export async function getOgTemplateWithDate(title: string, date: string, description: string) {
  return html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
      <div tw="flex flex-col flex-1 w-full p-10 justify-center">
        <h1 tw="text-5xl font-bold text-white">${title}</h1>
        <p tw="mt-0 text-4xl">${description}</p>
      </div>
      <div tw="flex justify-between w-full p-10 text-xl">
        <p tw="text-2xl">${date}</p>
        <p tw="font-semibold text-2xl">by ${SITE.AUTHOR}</p>
      </div>
    </div>`;
}

export async function getOgTemplateNoDate(title: string, description: string) {
  return html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
      <div tw="flex flex-col flex-1 w-full p-10 justify-center">
        <h1 tw="text-5xl font-bold text-white">${title}</h1>
        <p tw="mt-0 text-4xl">${description}</p>
      </div>
      <div tw="flex justify-end w-full p-10 text-xl">
        <p tw="font-semibold text-2xl">by ${SITE.AUTHOR}</p>
      </div>
    </div>`
}
