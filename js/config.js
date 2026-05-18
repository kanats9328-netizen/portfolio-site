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

  xPosts: [{ url: "https://x.com/oiomae_m9/status/1969735463817908262?s=20"}],

  profile: {
    icon: "images/icon.png",
    paragraphs: [
      "カ夏と申します",
      "主にイラスト・小説の制作をしています。",
      "最近 YouTube を始めました。ぜひ見てね。",
    ],
    workThemes: {
      title: "作品テーマ",
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
    url: "https://www.youtube.com/@YOUR_CHANNEL",
    title: "YouTube",
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
    email: "",
    sns: [
      { label: "X", url: "https://x.com/YOUR_HANDLE" },
      { label: "YouTube", url: "https://www.youtube.com/@YOUR_CHANNEL" },
      { label: "Instagram", url: "https://www.instagram.com/YOUR_HANDLE/" },
    ],
    commission: [
      { label: "Skeb", url: "https://skeb.jp/@YOUR_HANDLE" },
    ],
  },
};
