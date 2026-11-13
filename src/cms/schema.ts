// Everything editable in the CMS. Defaults reproduce the site's original copy
// exactly, so the first run looks identical to the hard-coded version.
import {
  bool, category, defineFields, group, image, items, list, select, slug, text, textarea, url, video, email,
  type Field, type FieldsValue,
} from "./fields";

// ── Singleton sections (stored as JSON in `settings`) ───────────────────────
export interface SectionDef<F extends readonly Field[] = readonly Field[]> {
  readonly key: string;
  readonly label: string;
  readonly group: "Site" | "Home page" | "Footer & SEO" | "Enquiries";
  readonly description: string;
  readonly fields: F;
  readonly defaults: FieldsValue<F>;
}

function section<const F extends readonly Field[]>(def: SectionDef<F>): SectionDef<F> {
  return def;
}

const siteFields = defineFields([
  text("name", "Owner name", { required: true, half: true }),
  text("brandName", "Brand name", { required: true, half: true }),
  text("tagline", "Tagline"),
  text("monogram", "Logo letters", { half: true, max: 4, help: "Shown in the square logo in the header and footer." }),
  text("city", "City", { half: true }),
  text("state", "State", { half: true }),
  text("country", "Country", { half: true }),
  text("coverage", "Coverage", { half: true }),
  email("email", "Public email", { half: true }),
  text("phone", "Phone (display)", { half: true, placeholder: "+91 98765 43210" }),
  text("whatsapp", "WhatsApp number (digits only)", { half: true, help: "Country code + number, no + or spaces. Example: 919504286539" }),
  textarea("whatsappMessage", "WhatsApp opening message", { rows: 2, help: "Pre-filled text when someone taps a WhatsApp button." }),
  url("youtube", "YouTube channel URL", { half: true }),
  url("instagram", "Instagram URL", { half: true }),
  items("extraLinks", "Other social links", [text("label", "Label", { required: true, half: true }), url("url", "URL", { required: true, half: true })], { titleField: "label", addLabel: "Add link" }),
]);

const navFields = defineFields([
  text("brandSub", "Line under the brand name"),
  items("links", "Menu links", [
    text("label", "Label", { required: true, half: true }),
    text("mobileLabel", "Mobile label", { half: true }),
    text("href", "Link target", { required: true, help: "Use #work, #capabilities, #bts, #about to jump to a section." }),
  ], { titleField: "label", addLabel: "Add menu link" }),
  text("channelLabel", "YouTube link label", { half: true }),
  text("whatsappLabel", "WhatsApp button", { half: true }),
  text("bookLabel", "Book button", { half: true }),
  text("mobileWhatsappLabel", "Mobile WhatsApp button", { half: true }),
  text("mobileBookLabel", "Mobile book button"),
]);

const heroFields = defineFields([
  text("locationChip", "Location chip", { help: "Appears after “Directed by …”." }),
  list("viewfinder", "Viewfinder specs", { max: 6, help: "Small technical strip at the top right (desktop)." }),
  text("headlinePre", "Headline — start", { half: true }),
  text("headlineAccent", "Headline — highlighted word", { half: true }),
  text("headlinePost", "Headline — end"),
  textarea("subhead", "Sub-headline", { rows: 3 }),
  text("primaryCta", "Primary button", { half: true }),
  text("whatsappCta", "WhatsApp button", { half: true }),
  text("secondaryCta", "Secondary button"),
  image("poster", "Showreel poster image", { required: true }),
  video("videoUrl", "Showreel video (optional)", { help: "MP4/WebM from the media library or a direct https link. Leave empty to show the poster only." }),
  text("reelTitle", "Showreel title"),
]);

const workFields = defineFields([
  text("eyebrow", "Small heading"),
  text("title", "Heading"),
  text("allLabel", "“All” filter label", { half: true }),
]);

const btsFields = defineFields([
  text("eyebrow", "Small heading"),
  text("title", "Heading"),
  textarea("text", "Paragraph", { rows: 3 }),
  image("image", "Image (before)", { required: true }),
  image("imageAfter", "Image (after)", { required: true }),
  text("caption", "Caption (bottom left)", { half: true }),
  text("specLabel", "Spec label (bottom right)", { half: true }),
  items("cards", "Feature cards", [text("title", "Title", { required: true }), textarea("text", "Text", { rows: 2 })], { titleField: "title", max: 4, addLabel: "Add card" }),
]);

const servicesSectionFields = defineFields([
  text("eyebrow", "Small heading"),
  text("title", "Heading"),
  textarea("intro", "Intro", { rows: 2 }),
  text("marquee", "Background scrolling text"),
  text("deliverablesLabel", "Deliverables label", { half: true }),
  text("turnaroundLabel", "Turnaround label", { half: true }),
  text("buttonLabel", "Package button"),
]);

const processSectionFields = defineFields([
  text("eyebrow", "Small heading"),
  text("title", "Heading"),
  textarea("intro", "Intro", { rows: 2 }),
  text("marquee", "Background text"),
]);

const youtubeSectionFields = defineFields([
  text("eyebrow", "Small heading"),
  text("title", "Heading"),
  textarea("intro", "Intro", { rows: 2 }),
  text("buttonLabel", "Subscribe button"),
]);

const aboutFields = defineFields([
  text("eyebrow", "Small heading"),
  text("name", "Name heading"),
  text("role", "Role line"),
  textarea("quote", "Quote", { rows: 4 }),
  textarea("body", "Paragraph", { rows: 3 }),
  text("locationLine", "Location line"),
  list("facts", "Fact chips", { max: 6, help: "Short facts shown at the bottom, e.g. “16K+ YouTube Community”." }),
  text("marquee", "Background text"),
]);

const ctaFields = defineFields([
  text("eyebrow", "Small heading"),
  text("title", "Heading"),
  textarea("text", "Paragraph", { rows: 3 }),
  text("primaryLabel", "Book button", { half: true }),
  text("whatsappLabel", "WhatsApp button", { half: true }),
]);

const projectPageFields = defineFields([
  text("backLabel", "Back link", { half: true }),
  text("viewfinderLabel", "Viewfinder label", { half: true }),
  text("ctaEyebrow", "Bottom block — small heading"),
  text("ctaTitle", "Bottom block — heading"),
  textarea("ctaText", "Bottom block — paragraph", { rows: 2 }),
  text("whatsappLabel", "WhatsApp button", { half: true }),
  text("bookLabel", "Book button", { half: true }),
]);

const footerFields = defineFields([
  textarea("description", "Description", { rows: 3 }),
  text("locationLine", "Location line"),
  text("navHeading", "Navigation heading", { half: true }),
  text("contactHeading", "Contact heading", { half: true }),
  items("links", "Navigation links", [text("label", "Label", { required: true, half: true }), text("href", "Link target", { required: true, half: true })], { titleField: "label", addLabel: "Add link" }),
  list("tags", "Bottom tags", { max: 6 }),
  text("copyright", "Copyright text", { help: "Shown after “© year”." }),
  text("whatsappLabel", "WhatsApp link label"),
]);

const seoFields = defineFields([
  url("siteUrl", "Website address", { required: true, help: "Used for the sitemap and links in emails. The SITE_URL environment variable overrides this." }),
  text("title", "Page title", { required: true, max: 120 }),
  textarea("description", "Description", { rows: 3, max: 320, help: "Shown in search results. Aim for 150–160 characters." }),
  list("keywords", "Keywords", { max: 20 }),
  text("ogTitle", "Social share title"),
  textarea("ogDescription", "Social share description", { rows: 2 }),
  image("ogImage", "Social share image", { help: "1200×630 recommended." }),
  text("twitterTitle", "X/Twitter title"),
  textarea("twitterDescription", "X/Twitter description", { rows: 2 }),
]);

const enquiryFields = defineFields([
  text("eyebrow", "Form — small heading"),
  text("title", "Form — heading"),
  textarea("subtitle", "Form — subtitle", { rows: 2 }),
  list("shootTypes", "Shoot categories", { max: 12, help: "Options in the “Shoot category” menu." }),
  text("defaultLocation", "Default location", { half: true }),
  text("submitLabel", "Submit button", { half: true }),
  list("deliverableOptions", "Deliverable choices", { max: 12 }),
  list("budgetOptions", "Budget ranges", { max: 10 }),
  text("successTitle", "Success — heading"),
  textarea("successText", "Success — message", { rows: 2 }),
  textarea("consentText", "Privacy notice under the form", { rows: 3 }),
  url("privacyUrl", "Privacy policy link (optional)"),
  bool("whatsappEnabled", "Open WhatsApp with the brief after sending"),
  bool("emailAlertEnabled", "Email me every new enquiry"),
  email("notifyEmail", "Alert email address", { help: "Leave empty to use NOTIFY_EMAIL or the public email." }),
  bool("autoReplyEnabled", "Send an automatic reply to the enquirer (when they give an email)"),
  text("autoReplySubject", "Auto-reply subject", { help: "Tokens: {name} {reference}" }),
  textarea("autoReplyBody", "Auto-reply message", { rows: 8, help: "Tokens: {name} {reference} {summary}" }),
]);

export const SECTIONS = {
  site: section({
    key: "site", label: "Brand & contact", group: "Site",
    description: "Name, contact details and social links used across the whole site.",
    fields: siteFields,
    defaults: {
      name: "Apoorva Shrivastava", brandName: "Car Dynasty", tagline: "Automotive Cinematographer & Director", monogram: "CD",
      city: "Bhopal", state: "Madhya Pradesh", country: "India", coverage: "Pan-India Availability",
      email: "cardynasty.01@gmail.com", phone: "+91 9504286539", whatsapp: "919504286539",
      whatsappMessage: "Hi Apoorva, I'd like to discuss an automotive shoot with Car Dynasty.",
      youtube: "https://www.youtube.com/@CARDYNASTY", instagram: "https://instagram.com/cardynasty1", extraLinks: [],
    },
  }),
  nav: section({
    key: "nav", label: "Navigation bar", group: "Site",
    description: "Header menu and button labels.",
    fields: navFields,
    defaults: {
      brandSub: "FILMS // BHOPAL • PAN-INDIA",
      links: [
        { label: "Work", mobileLabel: "Work / Films", href: "#work" },
        { label: "Services", mobileLabel: "Services & Packages", href: "#capabilities" },
        { label: "BTS", mobileLabel: "Behind The Frame", href: "#bts" },
        { label: "Director", mobileLabel: "Director & Story", href: "#about" },
      ],
      channelLabel: "16K+ Channel", whatsappLabel: "WhatsApp", bookLabel: "Book Shoot",
      mobileWhatsappLabel: "WhatsApp Direct", mobileBookLabel: "Book Project / Enquiry",
    },
  }),
  hero: section({
    key: "hero", label: "Hero", group: "Home page",
    description: "Top of the home page: headline, buttons and showreel.",
    fields: heroFields,
    defaults: {
      locationChip: "BHOPAL • PAN-INDIA",
      viewfinder: ["SHUTTER: 180°", "ASPECT: 2.39:1", "COLOR: ARRI LOG-C"],
      headlinePre: "CINEMATIC", headlineAccent: "AUTOMOTIVE", headlinePost: "STORYTELLING",
      subhead: "High-end commercial films, raw car culture documentaries, and hypercar showcases. Delivering editorial visual power across India for brands, car meets, and discerning collectors.",
      primaryCta: "Discuss A Project", whatsappCta: "WhatsApp Directly", secondaryCta: "Selected Works",
      poster: "/assets/hero/hero-poster.jpg", videoUrl: "", reelTitle: "CAR DYNASTY // MASTER CINEMATIC REEL 2026",
    },
  }),
  work: section({
    key: "work", label: "Selected work heading", group: "Home page",
    description: "Heading above the project list. Projects themselves are under Projects.",
    fields: workFields,
    defaults: { eyebrow: "PORTFOLIO ARCHIVE", title: "SELECTED FILMS & SHOWCASES", allLabel: "All" },
  }),
  bts: section({
    key: "bts", label: "Behind the frame", group: "Home page",
    description: "Before/after slider and feature cards.",
    fields: btsFields,
    defaults: {
      eyebrow: "BEHIND THE FRAME", title: "ENGINEERED FOR HIGH VELOCITY",
      text: "Real speed cannot be faked in post. We mount cinema-grade cameras on high-speed pursuit vehicles and rigid carbon suction mounts to capture cars behaving authentically at the limit.",
      image: "/assets/bts/camera-rig.jpg", imageAfter: "/assets/bts/camera-rig.jpg",
      caption: "SUCTION HOOD RIGGING SYSTEM", specLabel: "4K ARRI / RED",
      cards: [
        { title: "CHASE PURSUIT VEHICLES", text: "Hydra-arm and gyro-stabilized platforms tracking up to 100+ mph." },
        { title: "ACOUSTIC EXHAUST CAPTURE", text: "High-heat lavalier mics capturing unadulterated intake and exhaust tone." },
      ],
    },
  }),
  servicesSection: section({
    key: "servicesSection", label: "Services heading", group: "Home page",
    description: "Heading and labels for the packages section. Packages are under Services.",
    fields: servicesSectionFields,
    defaults: {
      eyebrow: "SERVICES & PACKAGES", title: "COMMISSION CAPABILITIES",
      intro: "Transparent production structures tailored for automotive brands, aftermarket builders, and private collectors.",
      marquee: "CINEMATICS // COMMISSIONS", deliverablesLabel: "Included Deliverables:", turnaroundLabel: "Turnaround:", buttonLabel: "Enquire for This Package",
    },
  }),
  processSection: section({
    key: "processSection", label: "Process heading", group: "Home page",
    description: "Heading for the four-step process. Steps are under Process steps.",
    fields: processSectionFields,
    defaults: {
      eyebrow: "FROM IDEA TO FINAL FRAME", title: "HOW WE EXECUTE",
      intro: "A rigorous four-step automotive filmmaking pipeline ensuring zero downtime on shoot days and flawless color accuracy.",
      marquee: "VELOCITY",
    },
  }),
  youtubeSection: section({
    key: "youtubeSection", label: "YouTube heading", group: "Home page",
    description: "Heading for the channel showcase. Videos are under YouTube videos.",
    fields: youtubeSectionFields,
    defaults: {
      eyebrow: "COMMUNITY FOOTPRINT", title: "YOUTUBE CHANNEL SHOWCASE",
      intro: "Featuring 200+ videos and over 16,000+ car culture enthusiasts across India.", buttonLabel: "Subscribe on YouTube",
    },
  }),
  about: section({
    key: "about", label: "About the director", group: "Home page",
    description: "Director biography block.",
    fields: aboutFields,
    defaults: {
      eyebrow: "THE DIRECTOR", name: "APOORVA SHRIVASTAVA", role: "FOUNDER & DIRECTOR OF CINEMATOGRAPHY // CAR DYNASTY",
      quote: "\"Cars are dynamic kinetic sculptures. They aren't meant to sit motionless under fluorescent lamps—they are designed to carve asphalt, displace air, and scream at redline. Car Dynasty was forged out of a singular obsession: documenting automotive culture in India with true cinematic discipline.\"",
      body: "Operating out of Bhopal, Madhya Pradesh, we deploy custom camera rigs, pursuit vehicles, and cinema packages nationwide for commercial campaigns, supercar rallies, and private enthusiast features.",
      locationLine: "Based in Bhopal • Deploying Pan-India",
      facts: ["16K+ YouTube Community", "200+ Automotive Master Films"], marquee: "DIRECTOR",
    },
  }),
  cta: section({
    key: "cta", label: "Contact call-to-action", group: "Home page",
    description: "Final “commission a shoot” block.",
    fields: ctaFields,
    defaults: {
      eyebrow: "COMMISSION A SHOOT", title: "LET'S CREATE SOMETHING MOVING.",
      text: "Whether you represent an automotive brand, organized car rally, or want a high-end cinematic feature of your vehicle, we deploy nationwide.",
      primaryLabel: "Book A Shoot Session", whatsappLabel: "WhatsApp Apoorva",
    },
  }),
  projectPage: section({
    key: "projectPage", label: "Project page text", group: "Home page",
    description: "Shared text on every project page.",
    fields: projectPageFields,
    defaults: {
      backLabel: "Back to Film Showcase", viewfinderLabel: "MASTER FILE // 4K 2.39:1",
      ctaEyebrow: "COMMISSION THE TEAM", ctaTitle: "COMMISSION A SIMILAR AUTOMOTIVE PRODUCTION",
      ctaText: "Deploying across Bhopal and Pan-India. Let's create an unforgettable visual campaign for your machine or brand.",
      whatsappLabel: "WhatsApp Directly", bookLabel: "Book Shoot",
    },
  }),
  footer: section({
    key: "footer", label: "Footer", group: "Footer & SEO",
    description: "Footer text and links.",
    fields: footerFields,
    defaults: {
      description: "Automotive cinematography, commercial storytelling, and car culture documentation. Directed by Apoorva Shrivastava. Based in Bhopal, deploying across India.",
      locationLine: "Bhopal, Madhya Pradesh • Pan-India Shoots", navHeading: "Navigation", contactHeading: "Direct Contact",
      links: [
        { label: "Commercial & Feature Films", href: "#work" },
        { label: "Production Packages", href: "#capabilities" },
        { label: "Behind The Frame / Grade", href: "#bts" },
        { label: "Apoorva Shrivastava", href: "#about" },
      ],
      tags: ["4K CINEMA", "ANAMORPHIC RIGS", "FPV DRONE"],
      copyright: "CAR DYNASTY. All rights reserved. Directed by Apoorva Shrivastava.", whatsappLabel: "WhatsApp Chat",
    },
  }),
  seo: section({
    key: "seo", label: "SEO & social sharing", group: "Footer & SEO",
    description: "Search engine and link-preview defaults. Each project can override its own title and description.",
    fields: seoFields,
    defaults: {
      siteUrl: "https://cardynasty.in",
      title: "Car Dynasty | Automotive Cinematographer & Director (Apoorva Shrivastava)",
      description: "Official portfolio of Car Dynasty directed by Apoorva Shrivastava. Premium automotive cinematography, brand campaigns, car meets, and exotic supercar feature films across India.",
      keywords: ["Automotive Cinematography India", "Car Dynasty", "Apoorva Shrivastava", "Automotive Filmmaker Bhopal", "Supercar Videography", "Car Commercial Director", "Car Meet Films India"],
      ogTitle: "Car Dynasty | Automotive Cinematography & Films",
      ogDescription: "Premium cinematic automotive storytelling across India. 16K+ YouTube community, 200+ films.",
      ogImage: "/assets/hero/hero-poster.jpg",
      twitterTitle: "Car Dynasty | Automotive Cinematography",
      twitterDescription: "Directed by Apoorva Shrivastava. 16K+ YouTube subscribers, 200+ films.",
    },
  }),
  enquiry: section({
    key: "enquiry", label: "Enquiry form & alerts", group: "Enquiries",
    description: "Booking form wording, choices, notifications and auto-reply.",
    fields: enquiryFields,
    defaults: {
      eyebrow: "PROJECT DISPATCH // DIRECT TO DIRECTOR", title: "BOOK AN AUTOMOTIVE SHOOT",
      subtitle: "Commercial campaigns, car meets, exotic private films across India.",
      shootTypes: ["Commercial Campaign", "Car Meet & Rally", "Supercar Private Film", "Social / Reels Production"],
      defaultLocation: "Bhopal", submitLabel: "Send Brief via WhatsApp",
      deliverableOptions: ["Hero film (60-90s)", "Social reels (9:16)", "Event aftermovie", "Stills / photography", "Drone / FPV footage", "Raw footage"],
      budgetOptions: ["Under ₹50,000", "₹50,000 – ₹1,50,000", "₹1,50,000 – ₹5,00,000", "Above ₹5,00,000", "Not sure yet"],
      successTitle: "ENQUIRY DISPATCHED",
      successText: "Your shoot brief has been received by Apoorva Shrivastava. We typically respond within 2-4 hours.",
      consentText: "By sending this you agree that Car Dynasty may contact you about this enquiry by WhatsApp, phone or email. Your details are stored securely and used only to respond.",
      privacyUrl: "", whatsappEnabled: true, emailAlertEnabled: true, notifyEmail: "", autoReplyEnabled: true,
      autoReplySubject: "We received your enquiry — {reference}",
      autoReplyBody: "Hi {name},\n\nThanks for reaching out to Car Dynasty. We've received your enquiry ({reference}) and will get back to you within 2–4 hours.\n\nYour brief:\n{summary}\n\n— Apoorva Shrivastava\nCar Dynasty",
    },
  }),
} as const;

export type SectionKey = keyof typeof SECTIONS;
export type SectionValue<K extends SectionKey> = (typeof SECTIONS)[K]["defaults"];

// ── Collections (one table each) ────────────────────────────────────────────
export interface ResourceDef<F extends readonly Field[] = readonly Field[]> {
  readonly key: string;
  readonly table: string;
  readonly label: string;
  readonly singular: string;
  readonly description: string;
  readonly fields: F;
  readonly titleField: string;
  readonly subtitleField?: string;
  readonly imageField?: string;
}

function resource<const F extends readonly Field[]>(def: ResourceDef<F>): ResourceDef<F> {
  return def;
}

const published = bool("published", "Published", { help: "Unpublished items are hidden from the website." });

export const categoryFields = defineFields([
  text("name", "Name", { required: true, half: true }),
  slug("slug", "URL name", { half: true }),
  bool("showInFilter", "Show as a filter button on the home page"),
  published,
]);

export const projectFields = defineFields([
  text("title", "Title", { required: true }),
  slug("slug", "URL name", { help: "The project page address: /projects/this-name", half: true }),
  category("categoryId", "Category", { half: true }),
  text("subtitle", "Subtitle", { max: 300 }),
  text("vehicle", "Vehicle", { half: true }),
  text("client", "Client / type", { half: true }),
  text("year", "Year", { half: true, max: 12 }),
  text("location", "Location", { half: true }),
  image("heroImage", "Hero image", { required: true }),
  video("videoUrl", "Video (optional)"),
  textarea("brief", "The brief", { rows: 4 }),
  textarea("creativeDirection", "Creative direction", { rows: 4 }),
  textarea("description", "Production notes", { rows: 5 }),
  list("services", "Delivered assets", { addLabel: "Add item" }),
  group("techSpecs", "Camera & tech specs", [
    text("camera", "Primary camera", { half: true }),
    text("lens", "Optics / lenses", { half: true }),
    text("rig", "Rigging system", { half: true }),
    text("resolution", "Capture resolution", { half: true }),
    text("framerate", "Framerate", { half: true }),
    text("colorGrade", "Color pipeline", { half: true }),
  ]),
  items("gallery", "Stills gallery", [
    image("url", "Image", { required: true }),
    text("caption", "Caption"),
    select("aspectRatio", "Shape", [{ value: "16/9", label: "16:9" }, { value: "21/9", label: "21:9" }, { value: "4/5", label: "4:5" }]),
  ], { titleField: "caption", addLabel: "Add image" }),
  text("seoTitle", "SEO title (optional)", { max: 120, help: "Overrides the page title in search results." }),
  textarea("seoDescription", "SEO description (optional)", { rows: 2, max: 320 }),
  bool("featured", "Featured"),
  published,
]);

export const serviceFields = defineFields([
  text("name", "Name", { required: true }),
  slug("slug", "URL name", { half: true }),
  text("targetAudience", "Target audience", { half: true, help: "The first comma-separated item is the small label on the card." }),
  text("tagline", "Tagline"),
  textarea("description", "Description", { rows: 4 }),
  list("deliverables", "Included deliverables", { addLabel: "Add deliverable" }),
  list("specs", "Specs", { addLabel: "Add spec" }),
  text("turnaroundTime", "Turnaround time", { half: true }),
  text("recommendedFor", "Recommended for", { half: true }),
  published,
]);

export const processFields = defineFields([
  text("step", "Step number", { required: true, half: true, max: 4 }),
  text("title", "Title", { required: true, half: true }),
  text("subtitle", "Subtitle"),
  textarea("description", "Description", { rows: 4 }),
  list("tasks", "Tasks", { addLabel: "Add task" }),
  published,
]);

export const youtubeFields = defineFields([
  text("title", "Title", { required: true }),
  url("url", "Video URL", { required: true, help: "Link to the specific video, e.g. https://www.youtube.com/watch?v=…" }),
  text("category", "Category", { half: true }),
  text("badge", "Badge", { half: true }),
  text("duration", "Duration", { half: true, placeholder: "08:45" }),
  published,
]);

export const statFields = defineFields([
  text("label", "Label", { required: true, half: true }),
  text("value", "Value", { required: true, half: true, help: "Numbers animate, e.g. 16K+ or 200+." }),
  text("detail", "Detail"),
  published,
]);

export const RESOURCES = {
  projects: resource({
    key: "projects", table: "projects", label: "Projects", singular: "project",
    description: "Case studies shown on the home page and as their own pages.",
    fields: projectFields, titleField: "title", subtitleField: "vehicle", imageField: "heroImage",
  }),
  categories: resource({
    key: "categories", table: "categories", label: "Project categories", singular: "category",
    description: "Used by projects and the filter buttons above the project list.",
    fields: categoryFields, titleField: "name",
  }),
  services: resource({
    key: "services", table: "services", label: "Services", singular: "package",
    description: "Commission packages in the services section.",
    fields: serviceFields, titleField: "name", subtitleField: "turnaroundTime",
  }),
  process: resource({
    key: "process", table: "process_steps", label: "Process steps", singular: "step",
    description: "The four-step “how we execute” section.",
    fields: processFields, titleField: "title", subtitleField: "step",
  }),
  youtube: resource({
    key: "youtube", table: "youtube_videos", label: "YouTube videos", singular: "video",
    description: "Curated videos in the channel showcase.",
    fields: youtubeFields, titleField: "title", subtitleField: "category",
  }),
  stats: resource({
    key: "stats", table: "stats", label: "Stats strip", singular: "stat",
    description: "The numbers strip under the hero.",
    fields: statFields, titleField: "label", subtitleField: "value",
  }),
} as const;

export type ResourceKey = keyof typeof RESOURCES;
export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[];

export function isResourceKey(k: string): k is ResourceKey {
  return Object.prototype.hasOwnProperty.call(RESOURCES, k);
}
export function isSectionKey(k: string): k is SectionKey {
  return Object.prototype.hasOwnProperty.call(SECTIONS, k);
}
