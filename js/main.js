(function () {
  const config = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};

  applySiteMeta(config);
  initTitleBackground(config);
  setupHeaderShrink();
  renderNews(config.news);
  renderXPosts(config.xPosts);
  renderProfile(config.profile);
  renderIllustrations(config.illustrations);
  renderNovels(config.novels);
  renderMovies(config.movies);
  renderYoutubeChannel(config.youtubeChannel);
  renderContact(config.contact);
  setupPanelNavigation();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

function applySiteMeta(config) {
  if (config.title) {
    document.title = config.title;
    const titleEl = document.querySelector(".site-title");
    if (titleEl) titleEl.textContent = config.title;
  }
}

function initTitleBackground(config) {
  const container = document.getElementById("title-bg");
  if (!container) return;

  const images = (config.titleBackgrounds || []).filter(Boolean);
  if (images.length === 0) return;

  container.innerHTML = images
    .map(
      (src, i) =>
        `<img src="${escapeAttr(src)}" alt="" class="title-bg-img${i === 0 ? " is-active" : ""}" loading="${i === 0 ? "eager" : "lazy"}">`
    )
    .join("");

  if (images.length < 2) return;

  const slides = container.querySelectorAll(".title-bg-img");
  let index = 0;
  const interval = config.titleBackgroundInterval || 6000;

  setInterval(() => {
    slides[index].classList.remove("is-active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-active");
  }, interval);
}

function setupHeaderShrink() {
  const siteTop = document.getElementById("site-top");
  const sentinel = document.getElementById("header-scroll-sentinel");
  if (!siteTop || !sentinel) return;

  let isCompact = false;
  let lockedUntil = 0;
  const LOCK_MS = 420;

  const applyCompact = (next) => {
    if (isCompact === next) return;
    isCompact = next;
    siteTop.classList.toggle("is-compact", next);
    lockedUntil = Date.now() + LOCK_MS;
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (Date.now() < lockedUntil) return;
      applyCompact(!entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);

  window.addEventListener(
    "scroll",
    () => {
      if (Date.now() < lockedUntil) return;
      const atTop = window.scrollY <= 8;
      if (atTop && isCompact) {
        applyCompact(false);
      }
    },
    { passive: true }
  );
}

function parseNewsDate(dateStr) {
  const normalized = String(dateStr).replace(/\./g, "-");
  const time = Date.parse(normalized);
  return Number.isNaN(time) ? 0 : time;
}

function renderNews(newsItems) {
  const list = document.getElementById("news-list");
  if (!list) return;

  const items = (Array.isArray(newsItems) ? newsItems : [])
    .filter((item) => item && String(item.text || "").trim())
    .sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));

  if (items.length === 0) {
    list.innerHTML = `<li class="news-empty"><code>config.js</code> の <code>news</code> にお知らせを追加してください。</li>`;
    return;
  }

  list.innerHTML = items
    .map(
      (item) => `
    <li class="news-item">
      <time class="news-date" datetime="">${escapeHtml(item.date || "")}</time>
      <p class="news-text">${escapeHtml(item.text)}</p>
    </li>
  `
    )
    .join("");
}

function normalizeTweetUrl(url) {
  if (!url) return "";
  return String(url).trim().replace(/twitter\.com/gi, "x.com");
}

function buildTweetEmbedHtml(post) {
  if (post.embedHtml && String(post.embedHtml).trim()) {
    return String(post.embedHtml).trim();
  }

  const url = normalizeTweetUrl(post.url);
  if (!url) return "";

  const preview =
    post.text && String(post.text).trim()
      ? `<p lang="ja" dir="ltr">${escapeHtml(post.text)}</p>`
      : "";

  return `
    <blockquote class="twitter-tweet" data-theme="light" data-dnt="true">
      ${preview}
      <a href="${escapeAttr(url)}"></a>
    </blockquote>
  `;
}

function ensureXWidgetsReady() {
  return new Promise((resolve) => {
    if (window.twttr?.widgets) {
      window.twttr.ready(resolve);
      return;
    }

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (window.twttr?.widgets) {
        clearInterval(timer);
        window.twttr.ready(resolve);
      } else if (attempts >= 100) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}

function loadXEmbeds(container) {
  if (!container) return;
  ensureXWidgetsReady().then(() => {
    if (window.twttr?.widgets) {
      window.twttr.widgets.load(container);
    }
  });
}

function renderXPosts(posts) {
  const grid = document.getElementById("x-posts-grid");
  if (!grid) return;

  const items = (Array.isArray(posts) ? posts : []).filter(
    (post) =>
      post &&
      (String(post.url || "").trim() || String(post.embedHtml || "").trim())
  );

  if (items.length === 0) {
    grid.innerHTML = `<p class="x-posts-empty"><code>js/config.js</code> の <code>xPosts</code> にポストの URL を追加してください。</p>`;
    return;
  }

  grid.innerHTML = items
    .map((post) => {
      const embed = buildTweetEmbedHtml(post);
      if (!embed) return "";
      return `<div class="x-post-embed">${embed}</div>`;
    })
    .filter(Boolean)
    .join("");

  if (!grid.innerHTML.trim()) {
    grid.innerHTML = `<p class="x-posts-empty">有効なポスト URL がありません。</p>`;
    return;
  }

  loadXEmbeds(grid);
}

function extractYouTubeId(url) {
  if (!url) return "";
  const match = String(url)
    .trim()
    .match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/
    );
  return match ? match[1] : "";
}

function getYouTubeWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function getYouTubeThumbnail(videoId, customThumbnail) {
  if (customThumbnail && String(customThumbnail).trim()) {
    return String(customThumbnail).trim();
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function isPlaceholderValue(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  return /YOUR_|example\.com|@YOUR|placeholder/i.test(text);
}

function getYoutubeUploadsPlaylistId(channelId) {
  const id = String(channelId || "").trim();
  if (!id) return "";
  if (id.startsWith("UC") && id.length > 2) return `UU${id.slice(2)}`;
  return id;
}

function renderYoutubeChannel(channel) {
  const container = document.getElementById("youtube-channel-embed");
  if (!container) return;

  const url = String(channel?.url || "").trim();
  if (!url || isPlaceholderValue(url)) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  const title = escapeHtml(channel?.title || "YouTube チャンネル");
  const channelId = String(channel?.channelId || "").trim();
  const uploadsPlaylistId = getYoutubeUploadsPlaylistId(channelId);

  let playerHtml = "";
  if (uploadsPlaylistId) {
    playerHtml = `
      <div class="youtube-channel-player">
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=${escapeAttr(uploadsPlaylistId)}"
          title="${title}の動画"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    `;
  } else if (channelId) {
    playerHtml = `
      <iframe
        class="youtube-channel-subscribe"
        src="https://www.youtube.com/subscribe_widget?p=${escapeAttr(channelId)}"
        title="${title}をチャンネル登録"
        loading="lazy"
      ></iframe>
    `;
  }

  container.innerHTML = `
    <div class="youtube-channel-card">
      <a class="youtube-channel-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">
        <span class="youtube-channel-icon" aria-hidden="true"></span>
        <span class="youtube-channel-text">
          <span class="youtube-channel-label">${title}</span>
          <span class="youtube-channel-cta">チャンネルを見る</span>
        </span>
      </a>
      ${playerHtml}
    </div>
  `;
  container.hidden = false;
}

function renderMovies(movies) {
  const grid = document.getElementById("movies-grid");
  if (!grid) return;

  const items = Array.isArray(movies) ? movies : [];
  if (items.length === 0) {
    grid.innerHTML = `<p class="movies-empty"><code>js/config.js</code> の <code>movies</code> に YouTube の URL を追加してください。</p>`;
    return;
  }

  const parts = items
    .map((item) => {
      if (!item) return "";

      const note = Array.isArray(item.text)
        ? item.text.map((line) => String(line).trim()).filter(Boolean).join("\n")
        : String(item.text || "").trim();

      if (note) {
        return `<p class="movies-note">${escapeHtml(note).replace(/\n/g, "<br>")}</p>`;
      }

      const url = String(item.url || "").trim();
      if (!url) return "";

      const videoId = extractYouTubeId(url);
      if (!videoId || videoId.includes("VIDEO_ID")) return "";

      const watchUrl = getYouTubeWatchUrl(videoId);
      const thumbSrc = getYouTubeThumbnail(videoId, item.thumbnail);
      const title = item.title ? escapeHtml(item.title) : "YouTube で見る";

      return `
      <a class="movie-card" href="${escapeAttr(watchUrl)}" target="_blank" rel="noopener noreferrer">
        <figure class="movie-thumb">
          <img src="${escapeAttr(thumbSrc)}" alt="${title}" loading="lazy">
          <span class="movie-play" aria-hidden="true">▶</span>
        </figure>
        <p class="movie-title">${title}</p>
      </a>
    `;
    })
    .filter(Boolean);

  grid.innerHTML =
    parts.join("") ||
    `<p class="movies-empty">有効な YouTube URL を <code>movies</code> に設定してください。</p>`;
}

function isWorkThemeImageBlock(block) {
  if (!block) return false;
  const type = String(block.type || "").toLowerCase();
  return type === "image" || Boolean(String(block.src || "").trim());
}

function renderWorkThemeImage(block) {
  const src = String(block.src || "").trim();
  if (!src) return "";

  const alt = escapeAttr(block.alt || "");
  const caption = String(block.caption || "").trim();

  return `
    <figure class="work-themes-figure">
      <img src="${escapeAttr(src)}" alt="${alt}" loading="lazy">
      ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
    </figure>
  `;
}

function renderWorkThemes(workThemes) {
  const section = document.getElementById("work-themes");
  const content = document.getElementById("work-themes-content");
  const titleEl = document.getElementById("work-themes-title");
  if (!section || !content) return;

  const blocks = Array.isArray(workThemes)
    ? workThemes
    : Array.isArray(workThemes?.blocks)
      ? workThemes.blocks
      : [];

  if (blocks.length === 0) {
    section.hidden = true;
    content.innerHTML = "";
    return;
  }

  const title = String(workThemes?.title || "作品テーマ").trim();
  if (titleEl && title) titleEl.textContent = title;

  const textHtml = blocks
    .filter((block) => !isWorkThemeImageBlock(block))
    .map((block) => {
      const text = String(block.text || block.content || "").trim();
      if (!text) return "";
      return `<p class="work-themes-text">${escapeHtml(text)}</p>`;
    })
    .filter(Boolean)
    .join("");

  const imageBlock = blocks.find(isWorkThemeImageBlock);
  const imageHtml = imageBlock ? renderWorkThemeImage(imageBlock) : "";

  const hasText = Boolean(textHtml);
  const hasImage = Boolean(imageHtml);

  content.innerHTML = `
    <div class="work-themes-layout${hasImage ? "" : " work-themes-layout--text-only"}">
      ${hasText ? `<div class="work-themes-text-col">${textHtml}</div>` : ""}
      ${hasImage ? `<div class="work-themes-visual-col">${imageHtml}</div>` : ""}
    </div>
  `;

  section.hidden = false;
}

function renderProfile(profile) {
  if (!profile) return;

  const iconImg = document.querySelector(".profile-icon img");
  if (iconImg && profile.icon) iconImg.src = profile.icon;

  const textWrap = document.querySelector(".profile-text");
  if (textWrap && Array.isArray(profile.paragraphs)) {
    textWrap.innerHTML = profile.paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }

  renderWorkThemes(profile.workThemes);
}

function renderIllustrations(items) {
  const grid = document.getElementById("illustration-grid");
  if (!grid || !Array.isArray(items) || items.length === 0) return;

  grid.innerHTML = items
    .map(
      (item) => `
    <figure class="illustration-item">
      <img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt || "")}" loading="lazy">
      ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
    </figure>
  `
    )
    .join("");
}

function renderNovels(novels) {
  const container = document.getElementById("novel-list");
  if (!container || !Array.isArray(novels) || novels.length === 0) return;

  container.innerHTML = novels
    .map((work, workIndex) => {
      const chaptersHtml = work.chapters
        .map((ch, chIndex) => {
          const id = `novel-${workIndex}-ch-${chIndex}`;
          return `
          <li class="novel-chapter">
            <button type="button" class="chapter-toggle" aria-expanded="false" aria-controls="${id}" id="${id}-btn">
              <span>${escapeHtml(ch.title)}</span>
              <span class="toggle-icon" aria-hidden="true">▼</span>
            </button>
            <div class="accordion-body chapter-body" id="${id}" role="region" aria-labelledby="${id}-btn">
              <div class="accordion-body-inner">
                <p class="chapter-text">${escapeHtml(ch.body)}</p>
              </div>
            </div>
          </li>
        `;
        })
        .join("");

      const workBodyId = `novel-work-${workIndex}-body`;

      return `
      <article class="novel-work">
        <button type="button" class="work-toggle" aria-expanded="false" aria-controls="${workBodyId}" id="${workBodyId}-btn">
          <span class="work-toggle-title">${escapeHtml(work.title)}</span>
          <span class="toggle-icon" aria-hidden="true">▼</span>
        </button>
        <div class="accordion-body work-body" id="${workBodyId}" role="region" aria-labelledby="${workBodyId}-btn">
          <div class="accordion-body-inner">
            <ul class="novel-chapters">${chaptersHtml}</ul>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  container.querySelectorAll(".work-toggle, .chapter-toggle").forEach((btn) => {
    btn.addEventListener("click", () => toggleAccordion(btn));
  });
}

function toggleAccordion(button) {
  const bodyId = button.getAttribute("aria-controls");
  const body = document.getElementById(bodyId);
  if (!body) return;

  const isOpen = button.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    button.setAttribute("aria-expanded", "false");
    body.classList.remove("is-open");
    return;
  }

  button.setAttribute("aria-expanded", "true");
  body.classList.add("is-open");
}

function renderContactLinkItem(item, email) {
  if (!item) return "";

  const label = String(item.label || "").trim();
  if (!label) return "";

  if (item.type === "email" || label.toLowerCase() === "email") {
    const address = String(item.url || email || "").trim();
    if (!address || isPlaceholderValue(address)) return "";
    return `<li><a href="mailto:${escapeAttr(address)}">${escapeHtml(address)}</a></li>`;
  }

  const url = String(item.url || "").trim();
  if (!url || isPlaceholderValue(url)) return "";

  return `<li><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`;
}

function renderContactLinks(listEl, items, email) {
  if (!listEl) return;

  const links = (Array.isArray(items) ? items : [])
    .map((item) => renderContactLinkItem(item, email))
    .filter(Boolean)
    .join("");

  listEl.innerHTML = links;
}

function renderContact(contact) {
  if (!contact) return;

  const snsList = document.getElementById("sns-links");
  const commissionList = document.getElementById("commission-links");

  renderContactLinks(snsList, contact.sns);

  const commissionItems = [...(Array.isArray(contact.commission) ? contact.commission : [])];
  if (contact.email && !isPlaceholderValue(contact.email)) {
    commissionItems.push({ label: "Email", type: "email", url: contact.email });
  }
  renderContactLinks(commissionList, commissionItems, contact.email);
}

const WORK_PANELS = ["illustration", "novel"];

function setupPanelNavigation() {
  const panels = document.querySelectorAll(".content-panel");
  const navLinks = document.querySelectorAll(".nav-link[data-panel]");

  function showPanel(panelId) {
    const target = document.querySelector(`.content-panel[data-panel="${panelId}"]`);
    if (!target) {
      if (panelId !== "information") showPanel("information");
      return;
    }

    panels.forEach((panel) => {
      const active = panel.dataset.panel === panelId;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.panel === panelId);
    });

    const workGroup = document.querySelector('[data-nav-group="work"]');
    if (workGroup) {
      workGroup.classList.toggle("nav-item--active", WORK_PANELS.includes(panelId));
    }

    if (location.hash !== `#${panelId}`) {
      history.replaceState(null, "", `#${panelId}`);
    }

    if (panelId === "information") {
      loadXEmbeds(document.getElementById("x-posts-grid"));
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPanel(link.dataset.panel);
    });
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (id) showPanel(id);
  });

  showPanel(location.hash.replace("#", "") || "information");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
