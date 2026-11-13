// Turns a YouTube channel snapshot (src/cms/youtube-snapshot.json, written by
// scripts/youtube-sync.mjs) into site content, and writes it to the database.
// Plain .mjs so both the app's seed and the sync script can use it.

const VEHICLES = [
  [/sierra/i, "Tata Sierra"],
  [/tiago\s*ev/i, "Tata Tiago EV"],
  [/nexon/i, "Tata Nexon"],
  [/grand\s*vitara/i, "Maruti Suzuki Grand Vitara"],
  [/kushaq/i, "Skoda Kushaq"],
  [/3xo/i, "Mahindra XUV 3XO"],
  [/thar\s*roxx/i, "Mahindra Thar Roxx"],
  [/wagon\s*r/i, "Maruti Suzuki Wagon R"],
  [/creta/i, "Hyundai Creta"],
];

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export const isShort = (v) => /#shorts?\b/i.test(v.title) || v.seconds <= 60;

export function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = String(sec % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function compact(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");

/** "Main title | extra | extra l" → ["Main title", "extra · extra"] */
function splitTitle(raw) {
  const parts = decode(raw)
    .replace(/(\s+[l|])+\s*$/, "")
    .split(/\s(?:\||l)\s|\|/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return [parts[0] ?? "", parts.slice(1).join(" · ")];
}

const cleanShortTitle = (raw) => decode(raw).replace(/#\S+/g, "").replace(/\s+/g, " ").replace(/[\s.!]+$/, (m) => m.trim()).trim();

export function buildContent(snap) {
  const longform = snap.videos.filter((v) => !isShort(v)).sort((a, b) => b.views - a.views);
  const shorts = snap.videos.filter(isShort).sort((a, b) => b.views - a.views);

  const categoryOf = (title) =>
    /walk\s*around/i.test(title) ? "Walkaround Review" : /owner|ownership|long term/i.test(title) ? "Ownership Review" : "Car Review";

  const seen = new Set();
  const projects = longform.map((v, i) => {
    const [title, subtitle] = splitTitle(v.title);
    const vehicle = VEHICLES.find(([re]) => re.test(v.title))?.[1] ?? "";
    let slug = slugify(vehicle ? `${vehicle} review` : title) || v.id.toLowerCase();
    if (seen.has(slug)) slug = `${slug}-${v.id.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    seen.add(slug);
    const date = new Date(v.published);
    // Keep the opening of the description; drop keyword lists, hashtags and link dumps.
    const brief = decode(v.description)
      .split(/\n\s*\n|\n\s*(?:related searches|tags|keywords|#|https?:\/\/)/i)[0]
      .trim()
      .slice(0, 600);
    return {
      slug,
      title,
      subtitle,
      category: categoryOf(v.title),
      vehicle,
      client: "CAR DYNASTY · YouTube",
      year: String(date.getUTCFullYear()),
      location: "India",
      heroImage: v.thumbnail,
      videoUrl: `https://www.youtube.com/watch?v=${v.id}`,
      brief,
      creativeDirection: "",
      description: `${v.views.toLocaleString("en-IN")} views on YouTube · ${formatDuration(v.seconds)} runtime · published ${date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}.`,
      services: [`Full-length YouTube review (${formatDuration(v.seconds)})`],
      techSpecs: {},
      gallery: [],
      seoTitle: "",
      seoDescription: brief.slice(0, 300),
      featured: i < 3,
      published: true,
    };
  });

  const youtube = shorts.map((v) => ({
    title: cleanShortTitle(v.title),
    category: "Short",
    url: `https://www.youtube.com/shorts/${v.id}`,
    duration: formatDuration(v.seconds),
    badge: `${compact(v.views)} views`,
    published: true,
  }));

  const topViews = Math.max(0, ...snap.videos.map((v) => v.views));
  const recentViews = snap.videos.reduce((n, v) => n + v.views, 0);
  const stats = [
    { label: "Community", value: snap.channel.subscribers, detail: "YouTube subscribers", published: true },
    { label: "Videos", value: `${snap.channel.videoCount}+`, detail: "Published on the channel", published: true },
    { label: "Top review", value: `${compact(topViews)}+`, detail: "Views on the most-watched review", published: true },
    { label: "Recent reach", value: `${compact(recentViews)}+`, detail: `Views on the latest ${snap.videos.length} uploads`, published: true },
  ];

  const categories = [...new Set(projects.map((p) => p.category))].map((name) => ({
    name,
    slug: slugify(name),
    showInFilter: true,
    published: true,
  }));

  return { categories, projects, youtube, stats };
}

/** Replaces categories, projects, YouTube videos and stats. Leaves everything else alone. */
export function applyContent(db, content) {
  const now = new Date().toISOString();
  db.transaction(() => {
    db.exec("DELETE FROM projects; DELETE FROM categories; DELETE FROM youtube_videos; DELETE FROM stats;");
    const catIds = new Map();
    const insCat = db.prepare("INSERT INTO categories (name, slug, show_in_filter, published, sort, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?, ?)");
    content.categories.forEach((c, i) => catIds.set(c.name, Number(insCat.run(c.name, c.slug, c.showInFilter ? 1 : 0, i + 1, now, now).lastInsertRowid)));

    const insProj = db.prepare(`INSERT INTO projects (slug, title, subtitle, category_id, vehicle, client, year, location, hero_image, video_url,
      brief, creative_direction, description, services, tech_specs, gallery, seo_title, seo_description, featured, published, sort, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`);
    content.projects.forEach((p, i) =>
      insProj.run(p.slug, p.title, p.subtitle, catIds.get(p.category) ?? null, p.vehicle, p.client, p.year, p.location, p.heroImage, p.videoUrl,
        p.brief, p.creativeDirection, p.description, JSON.stringify(p.services), JSON.stringify(p.techSpecs), JSON.stringify(p.gallery),
        p.seoTitle, p.seoDescription, p.featured ? 1 : 0, i + 1, now, now),
    );

    const insYt = db.prepare("INSERT INTO youtube_videos (title, category, url, duration, badge, published, sort, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)");
    content.youtube.forEach((v, i) => insYt.run(v.title, v.category, v.url, v.duration, v.badge, i + 1, now, now));

    const insStat = db.prepare("INSERT INTO stats (label, value, detail, published, sort, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?, ?)");
    content.stats.forEach((s, i) => insStat.run(s.label, s.value, s.detail, i + 1, now, now));
  })();
}
