/**
 * 公開用の設定テンプレート — このファイルを config.js にコピーし、
 * 公開してよい情報だけを入力してください（メール・SNS・本名に近い表記は非公開推奨）
 */
const SITE_CONFIG = {
  title: "Portfolio",

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

  xPosts: [
    // { url: "https://x.com/YOUR_HANDLE/status/0000000000000000000" },
  ],

  profile: {
    icon: "images/icon.png",
    paragraphs: [
      "はじめまして。",
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
