/**
 * サイト設定 — 公開前に個人を特定しうる情報（本名・メール・非公開アカウント等）が
 * 入っていないか確認してください。テンプレートは config.example.js を参照。
 */
const SITE_CONFIG = {
  title: "KANATSU`s Portfolio",

  titleBackgrounds: [
    "images/illust-06.png",
    "images/illust-02.png",
    "images/illust-03.png",
    "images/illust-04.png",
  ],
  titleBackgroundInterval: 6000,

  news: [
    { date: "2026.05.18", text: "ポートフォリオサイトを公開しました。" },
    { date: "2025.05.18", text: "YouTube チャンネルを開設しました。" },
  ],

  xProfileHandle: "oiomae_m9",
  xPosts: [
    { url: "https://x.com/oiomae_m9/status/1969735463817908262" },
    { url: "https://x.com/oiomae_m9/status/1970321455398408230" },
  ],

  profile: {
    icon: "images/icon.png",
    paragraphs: [
      "カ夏と申します",
      "主にイラスト・小説の制作をしています。",
      "最近 YouTube を始めました。ぜひ見てね。",
    ],
    workThemes: {
      title: "",
      blocks: [
        {
          type: "text",
          text: "主に二次創作を制作しています。現在はブルアカを中心に制作しています。",
        },
        {
          type: "image",
          src: "images/illust-01.png",
          alt: "作風の例",
          caption: "作風イメージ",
        },
        {
          type: "text",
          text: "キャラクターの感情線を丁寧に描くのが得意です。依頼の際は雰囲気の参考画像があると嬉しいです。",
        },
      ],
    },
  },

  illustrations: [
    { src: "images/illust-01.png", alt: "イラスト 1", caption: "" },
    { src: "images/illust-02.png", alt: "イラスト 2", caption: "" },
    { src: "images/illust-03.png", alt: "イラスト 3", caption: "" },
    { src: "images/illust-04.png", alt: "イラスト 4", caption: "" },
    { src: "images/illust-05.png", alt: "イラスト 5", caption: "" },
    { src: "images/illust-06.png", alt: "イラスト 6", caption: "" },
  ],

  youtubeChannel: {
    url: "https://www.youtube.com/@カ夏",
    title: "カ夏",
    channelId: "",
  },

  movies: [
    {
      text: "coming soon...",
    },
  ],

  novels: [
    {
      title: "未定",
      chapters: [
        {
          title: "未定",
          body: "未定",
        },
      ],
    },
  ],

  contact: {
    email: "kanats9328@gmail.com",
    sns: [
      { label: "X", url: "https://x.com/kanatsu_89va" },
      { label: "YouTube", url: "https://www.youtube.com/channel/UC6lZ_2-_FQk17lM7SD_CFXAL" },
      { label: "Instagram", url: "https://www.instagram.com/kanatsu_89va/" },
    ],
    commission: [
      { label: "Skeb", url: "https://skeb.jp/@kanatsu_89va" },
    ],
  },
};
