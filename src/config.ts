import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://sacdenoeuds.github.io/blog", // replace this with your deployed domain
  author: "SacDeNoeuds",
  desc: "Collection of TILs and other acquired knowledge on my developer journey.",
  title: "SacDeNœuds",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 300,
  height: undefined,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/SacDeNoeuds",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:sacdenoeuds.dev@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  // {
  //   name: "YouTube",
  //   href: "https://github.com/satnaing/astro-paper",
  //   linkTitle: `${SITE.title} on YouTube`,
  //   active: false,
  // },
  // {
  //   name: "CodePen",
  //   href: "https://github.com/satnaing/astro-paper",
  //   linkTitle: `${SITE.title} on CodePen`,
  //   active: false,
  // },
  // {
  //   name: "Reddit",
  //   href: "https://github.com/satnaing/astro-paper",
  //   linkTitle: `${SITE.title} on Reddit`,
  //   active: false,
  // },
];
