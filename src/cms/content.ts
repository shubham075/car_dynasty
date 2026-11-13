import "server-only";
import { cache } from "react";
import { getDb } from "./db";
import { getSection } from "./settings";
import { listRows } from "./repo";
import type { FieldsValue } from "./fields";
import { RESOURCES, categoryFields, processFields, projectFields, serviceFields, statFields, youtubeFields, type SectionValue } from "./schema";
import { waUrl } from "@/lib/whatsapp";

type Meta = { id: number };
export type Project = FieldsValue<typeof projectFields> & Meta & { category: string };
export type ServicePackage = FieldsValue<typeof serviceFields> & Meta;
export type ProcessStep = FieldsValue<typeof processFields> & Meta;
export type YouTubeVideo = FieldsValue<typeof youtubeFields> & Meta;
export type Stat = FieldsValue<typeof statFields> & Meta;
export type Category = FieldsValue<typeof categoryFields> & Meta;
export type ProjectMedia = Project["gallery"][number];

/** The part of the enquiry settings that is safe to send to visitors' browsers. */
export type EnquiryConfig = Omit<SectionValue<"enquiry">, "notifyEmail" | "emailAlertEnabled" | "autoReplyEnabled" | "autoReplySubject" | "autoReplyBody">;

export const getSite = cache(() => {
  const site = getSection("site");
  return { ...site, whatsappUrl: waUrl(site.whatsapp, site.whatsappMessage) };
});
export type Site = ReturnType<typeof getSite>;

export const getEnquiryConfig = cache((): EnquiryConfig => {
  const { notifyEmail, emailAlertEnabled, autoReplyEnabled, autoReplySubject, autoReplyBody, ...pub } = getSection("enquiry");
  void notifyEmail; void emailAlertEnabled; void autoReplyEnabled; void autoReplySubject; void autoReplyBody;
  return pub;
});

export const getProjects = cache((): Project[] => {
  const db = getDb();
  const cats = new Map(listRows(db, RESOURCES.categories).map((c) => [c.id, String(c.name)]));
  return listRows(db, RESOURCES.projects, { onlyPublished: true }).map((r) => ({
    ...(r as unknown as Project),
    category: cats.get(Number(r.categoryId)) ?? "",
  }));
});

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export const getCategories = cache(() => listRows(getDb(), RESOURCES.categories, { onlyPublished: true }) as unknown as Category[]);
export const getServices = cache(() => listRows(getDb(), RESOURCES.services, { onlyPublished: true }) as unknown as ServicePackage[]);
export const getProcessSteps = cache(() => listRows(getDb(), RESOURCES.process, { onlyPublished: true }) as unknown as ProcessStep[]);
export const getYouTubeVideos = cache(() => listRows(getDb(), RESOURCES.youtube, { onlyPublished: true }) as unknown as YouTubeVideo[]);
export const getStats = cache(() => listRows(getDb(), RESOURCES.stats, { onlyPublished: true }) as unknown as Stat[]);

/** Absolute site URL: SITE_URL env wins, otherwise the SEO setting. */
export function getSiteUrl(): string {
  return (process.env.SITE_URL || getSection("seo").siteUrl).replace(/\/+$/, "");
}
