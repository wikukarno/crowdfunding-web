"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { clearSession, getToken, setSession } from "./session";
import {
  createCampaignSchema,
  donateSchema,
  fieldErrors,
  loginSchema,
  registerSchema,
} from "./schemas";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const failed = (message: string): ActionState => ({ error: message });
const fromApi = (e: unknown): ActionState =>
  failed(e instanceof ApiError ? e.message : "Something went wrong.");

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  try {
    const user = await api.login(parsed.data);
    await setSession(user.token, user.name);
  } catch (e) {
    return fromApi(e);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  try {
    const user = await api.register(parsed.data);
    await setSession(user.token, user.name);
  } catch (e) {
    return fromApi(e);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createCampaignAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getToken();
  if (!token) redirect("/login");

  const parsed = createCampaignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  let id: string;
  try {
    const campaign = await api.createCampaign(token, parsed.data);
    id = campaign.id;
  } catch (e) {
    return fromApi(e);
  }

  revalidatePath("/");
  redirect(`/campaigns/${id}`);
}

export async function donateAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = await getToken();
  if (!token) redirect("/login");

  const parsed = donateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  let paymentUrl: string;
  try {
    const tx = await api.createTransaction(token, parsed.data);
    paymentUrl = tx.payment_url;
  } catch (e) {
    return fromApi(e);
  }

  // Hand off to the Midtrans payment page.
  redirect(paymentUrl);
}
