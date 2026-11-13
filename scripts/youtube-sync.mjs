#!/usr/bin/env node
// Pulls public data from the CAR DYNASTY YouTube channel (no API key needed).
//   npm run youtube:sync            → refresh src/cms/youtube-snapshot.json
//   npm run youtube:sync -- --apply → also replace projects/videos/stats in the DB
// The public RSS feed only lists the latest 15 uploads.
import fs from "node:fs";
import path from "node:path";
import { openDatabase } from "../src/cms/core/db.mjs";
import { applyContent, buildContent } from "../src/cms/core/youtube-content.mjs";

const HANDLE = process.env.YOUTUBE_HANDLE || "CARDYNASTY";
const OUT = path.join("src", "cms", "youtube-snapshot.json");
const HEADERS = { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" };

async function get(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

const pick = (re, s) => s.match(re)?.[1];
const tag = (name, s) => pick(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`), s) ?? "";

async function thumbnail(id) {
  const max = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const res = await fetch(max, { method: "HEAD" });
  return res.ok ? max : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

const page = await get(`https://www.youtube.com/@${HANDLE}`);
const channelId = pick(/"externalId":"(UC[\w-]{22})"/, page) ?? pick(/"channelId":"(UC[\w-]{22})"/, page);
if (!channelId) throw new Error("Could not find the channel ID.");
const channel = {
  handle: `@${HANDLE}`,
  id: channelId,
  url: `https://www.youtube.com/@${HANDLE}`,
  subscribers: pick(/([\d.,]+[KM]?) subscribers/, page) ?? "",
  videoCount: Number((pick(/([\d,]+) videos/, page) ?? "0").replace(/,/g, "")),
};

const feed = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
const entries = feed.split("<entry>").slice(1);
const videos = [];
for (const e of entries) {
  const id = tag("yt:videoId", e);
  const watch = await get(`https://www.youtube.com/watch?v=${id}`);
  videos.push({
    id,
    title: tag("title", e),
    published: tag("published", e),
    views: Number(pick(/<media:statistics views="(\d+)"/, e) ?? 0),
    description: tag("media:description", e),
    seconds: Number(pick(/"lengthSeconds":"(\d+)"/, watch) ?? 0),
    thumbnail: await thumbnail(id),
  });
  process.stdout.write(".");
}

const snapshot = { fetchedAt: new Date().toISOString(), channel, videos };
fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`\nSaved ${videos.length} videos (${channel.subscribers} subscribers) to ${OUT}`);

if (process.argv.includes("--apply")) {
  const db = openDatabase();
  const content = buildContent(snapshot);
  applyContent(db, content);
  db.close();
  console.log(`Applied: ${content.projects.length} projects, ${content.youtube.length} shorts, ${content.stats.length} stats.`);
}
