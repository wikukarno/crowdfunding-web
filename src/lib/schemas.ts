import { z } from "zod";

/* ── API response shapes (validate what the Go API returns) ───────────── */

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  occupation: z.string(),
  email: z.string(),
  token: z.string(),
  image_url: z.string(),
});

export const campaignSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  short_description: z.string(),
  image_url: z.string(),
  goal_amount: z.number(),
  current_amount: z.number(),
  slug: z.string(),
});

export const campaignDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  short_description: z.string(),
  description: z.string(),
  image_url: z.string(),
  goal_amount: z.number(),
  current_amount: z.number(),
  backer_count: z.number(),
  user_id: z.string(),
  slug: z.string(),
  perks: z.array(z.string()).nullable().default([]),
  user: z.object({ name: z.string(), image_url: z.string() }),
  images: z
    .array(z.object({ image_url: z.string(), is_primary: z.boolean() }))
    .nullable()
    .default([]),
});

export const transactionSchema = z.object({
  id: z.string(),
  campaign_id: z.string(),
  user_id: z.string(),
  amount: z.number(),
  code: z.string(),
  status: z.string(),
  payment_url: z.string(),
});

export const userTransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.string(),
  created_at: z.string(),
  campaign: z.object({ name: z.string(), image_url: z.string() }),
});

/** Public runtime config the API hands to the web app. */
export const appConfigSchema = z.object({
  payments_enabled: z.boolean(),
  support_email: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Campaign = z.infer<typeof campaignSchema>;
export type CampaignDetail = z.infer<typeof campaignDetailSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type UserTransaction = z.infer<typeof userTransactionSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;

/* ── Form input validation ────────────────────────────────────────────── */

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Tell us your name."),
  occupation: z.string().min(2, "What do you do?"),
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Use at least 6 characters."),
});

export const createCampaignSchema = z.object({
  name: z.string().min(4, "Give your campaign a clear title."),
  short_description: z
    .string()
    .min(10, "Add a one-line summary (10+ characters)."),
  description: z.string().min(30, "Describe your campaign (30+ characters)."),
  goal_amount: z.coerce
    .number()
    .int("Use a whole number.")
    .min(10000, "Set a goal of at least Rp 10.000."),
  perks: z.string().min(1, "List at least one perk."),
});

export const donateSchema = z.object({
  campaign_id: z.string().min(1),
  amount: z.coerce
    .number()
    .int("Use a whole number.")
    .min(10000, "Minimum donation is Rp 10.000."),
});

/** Map a ZodError into a flat { field: message } object for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
