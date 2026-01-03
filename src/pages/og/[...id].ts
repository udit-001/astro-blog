import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('blog');

const pages = Object.fromEntries(collectionEntries.map(({ id, data }) => [id, data]));

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'id',
  pages: pages,


  getImageOptions: (path, page) => {
    return {
      title: page.title,
      description: page.description,
      bgGradient: [[23, 23, 23]]
    }
  },
});
