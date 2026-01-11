import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Udit's Blog",
  DESCRIPTION: "Software development, technology, and curiosities.",
  AUTHOR: "Udit Mittal",
  EMAIL: "trevortylerlee@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects with links to repositories and live demos.",
};

export const BOOKMARKS: Metadata = {
  TITLE: "Bookmarks",
  DESCRIPTION: "A collection of bookmarked articles and resources.",
};

export const PROMPTS: Metadata = {
  TITLE: "Prompts",
  DESCRIPTION: "A collection of my curated prompts.",
};

export const VIDEOS: Metadata = {
  TITLE: "Videos",
  DESCRIPTION: "A collection of bookmarked YouTube videos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "X (formerly Twitter)",
    HREF: "https://twitter.com/boogerbuttcheek",
  },
  {
    NAME: "GitHub",
    HREF: "https://github.com/trevortylerlee",
  },
  {
    NAME: "Website",
    HREF: "https://trevortylerlee.com",
  },
];
