// Field definitions: the single source of truth for what the CMS can edit.
// The same definitions produce (1) TypeScript types, (2) Zod validation,
// (3) default/seed values and (4) the admin form UI.
import { z } from "zod";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface Base {
  readonly name: string;
  readonly label: string;
  readonly help?: string;
  readonly placeholder?: string;
  /** Render at half width next to the following half-width field. */
  readonly half?: boolean;
}

export type Field =
  | (Base & { readonly kind: "text" | "textarea" | "url" | "email" | "slug"; readonly required?: boolean; readonly max?: number; readonly rows?: number })
  | (Base & { readonly kind: "image" | "video"; readonly required?: boolean })
  | (Base & { readonly kind: "boolean" })
  | (Base & { readonly kind: "select"; readonly options: readonly SelectOption[] })
  /** Select whose options are the categories table; stores the category id. */
  | (Base & { readonly kind: "category" })
  | (Base & { readonly kind: "list"; readonly max?: number; readonly itemMax?: number; readonly addLabel?: string })
  | (Base & { readonly kind: "group"; readonly fields: readonly Field[] })
  | (Base & { readonly kind: "items"; readonly fields: readonly Field[]; readonly max?: number; readonly titleField?: string; readonly addLabel?: string });

// ── Value types derived from a field list ───────────────────────────────────
export type FieldValue<F> = F extends { kind: "boolean" }
  ? boolean
  : F extends { kind: "category" }
    ? number | null
    : F extends { kind: "list" }
      ? string[]
      : F extends { kind: "group"; fields: infer G extends readonly Field[] }
        ? FieldsValue<G>
        : F extends { kind: "items"; fields: infer G extends readonly Field[] }
          ? FieldsValue<G>[]
          : string;

export type FieldsValue<Fs extends readonly Field[]> = {
  -readonly [F in Fs[number] as F["name"]]: FieldValue<F>;
};

// ── Builders (keep schema files short and keep literal names for typing) ───
interface BaseOpts {
  help?: string;
  placeholder?: string;
  half?: boolean;
  required?: boolean;
  max?: number;
  rows?: number;
  itemMax?: number;
  addLabel?: string;
  titleField?: string;
}
type Opts<_K extends Field["kind"]> = BaseOpts;

export const defineFields = <const T extends readonly Field[]>(fields: T): T => fields;

export const text = <const N extends string>(name: N, label: string, o: Opts<"text"> = {}) =>
  ({ kind: "text", name, label, ...o }) as const;
export const textarea = <const N extends string>(name: N, label: string, o: Opts<"textarea"> = {}) =>
  ({ kind: "textarea", name, label, ...o }) as const;
export const url = <const N extends string>(name: N, label: string, o: Opts<"url"> = {}) =>
  ({ kind: "url", name, label, ...o }) as const;
export const email = <const N extends string>(name: N, label: string, o: Opts<"email"> = {}) =>
  ({ kind: "email", name, label, ...o }) as const;
export const slug = <const N extends string>(name: N, label: string, o: Opts<"slug"> = {}) =>
  ({ kind: "slug", name, label, ...o }) as const;
export const image = <const N extends string>(name: N, label: string, o: Opts<"image"> = {}) =>
  ({ kind: "image", name, label, ...o }) as const;
export const video = <const N extends string>(name: N, label: string, o: Opts<"video"> = {}) =>
  ({ kind: "video", name, label, ...o }) as const;
export const bool = <const N extends string>(name: N, label: string, o: Opts<"boolean"> = {}) =>
  ({ kind: "boolean", name, label, ...o }) as const;
export const select = <const N extends string>(name: N, label: string, options: readonly SelectOption[], o: Opts<"select"> = {}) =>
  ({ kind: "select", name, label, options, ...o }) as const;
export const category = <const N extends string>(name: N, label: string, o: Opts<"category"> = {}) =>
  ({ kind: "category", name, label, ...o }) as const;
export const list = <const N extends string>(name: N, label: string, o: Opts<"list"> = {}) =>
  ({ kind: "list", name, label, ...o }) as const;
export const group = <const N extends string, const G extends readonly Field[]>(name: N, label: string, fields: G, o: Opts<"group"> = {}) =>
  ({ kind: "group", name, label, fields, ...o }) as const;
export const items = <const N extends string, const G extends readonly Field[]>(name: N, label: string, fields: G, o: Opts<"items"> = {}) =>
  ({ kind: "items", name, label, fields, ...o }) as const;

// ── Zod validation built from the definitions ───────────────────────────────
const SAFE_URL = /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i;
const SAFE_MEDIA = /^(https?:\/\/|\/(?!\/))/i;

export function fieldSchema(f: Field): z.ZodType {
  switch (f.kind) {
    case "text":
    case "textarea": {
      const base = z.string().trim().max(f.max ?? (f.kind === "textarea" ? 6000 : 400));
      return f.required ? base.min(1, `${f.label} is required`) : base;
    }
    case "slug":
      return z
        .string()
        .trim()
        .toLowerCase()
        .min(1, `${f.label} is required`)
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single dashes");
    case "email": {
      const base = z.string().trim().max(200);
      return f.required
        ? base.pipe(z.email("Enter a valid email address"))
        : base.refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address");
    }
    case "url":
    case "image":
    case "video": {
      const re = f.kind === "url" ? SAFE_URL : SAFE_MEDIA;
      const base = z
        .string()
        .trim()
        .max(600)
        .refine((v) => v === "" || re.test(v), f.kind === "url" ? "Use a full https:// link or a /path" : "Use a /path from the media library or a full https:// link");
      return f.required ? base.refine((v) => v !== "", `${f.label} is required`) : base;
    }
    case "boolean":
      return z.boolean();
    case "select":
      return z.enum(f.options.map((o) => o.value) as [string, ...string[]], { error: `Choose a valid ${f.label.toLowerCase()}` });
    case "category":
      return z.number().int().positive().nullable();
    case "list":
      return z.preprocess(
        (v) => (Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x.trim() : x)).filter((x) => x !== "") : v),
        z.array(z.string().max(f.itemMax ?? 400)).max(f.max ?? 60),
      );
    case "group":
      return objectSchema(f.fields);
    case "items":
      return z.preprocess(
        (v) => (Array.isArray(v) ? v : []),
        z.array(objectSchema(f.fields)).max(f.max ?? 60),
      );
  }
}

export function objectSchema(fields: readonly Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

/** Empty value for a field — used for "new record" forms and as a fallback. */
export function emptyValue(f: Field): unknown {
  switch (f.kind) {
    case "boolean":
      return false;
    case "category":
      return null;
    case "list":
    case "items":
      return [];
    case "group":
      return emptyValues(f.fields);
    case "select":
      return f.options[0]?.value ?? "";
    default:
      return "";
  }
}

export function emptyValues(fields: readonly Field[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}

/** Deep-merge stored values over defaults so newly added fields never come back undefined. */
export function withDefaults<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (defaults && typeof defaults === "object") {
    const src = stored && typeof stored === "object" && !Array.isArray(stored) ? (stored as Record<string, unknown>) : {};
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      out[key] = withDefaults((defaults as Record<string, unknown>)[key], src[key]);
    }
    return out as T;
  }
  return (stored === undefined || stored === null || typeof stored !== typeof defaults ? defaults : stored) as T;
}

/** Flatten Zod issues to `{ "gallery.0.url": "message" }` for the admin forms. */
export function flattenIssues(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
