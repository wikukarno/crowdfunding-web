import { z } from "zod";
import {
  appConfigSchema,
  campaignDetailSchema,
  campaignSchema,
  transactionSchema,
  userSchema,
  userTransactionSchema,
  type AppConfig,
  type Campaign,
  type CampaignDetail,
  type Transaction,
  type User,
  type UserTransaction,
} from "./schemas";

// Trim any trailing slash so a value like ".../api/v1/" can't produce a
// double-slashed "//users" path (which the API rejects with a 404).
const BASE_URL = (process.env.API_URL ?? "http://localhost:8081/api/v1").replace(
  /\/+$/,
  "",
);

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type RequestOptions<T extends z.ZodTypeAny> = {
  schema: T;
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function apiRequest<T extends z.ZodTypeAny>(
  path: string,
  { schema, method = "GET", body, token }: RequestOptions<T>,
): Promise<z.infer<T>> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Can't reach the API. Make sure the backend is running.",
      0,
    );
  }

  const json = (await res.json().catch(() => null)) as
    | { meta?: { message?: string }; data?: unknown }
    | null;

  if (!res.ok) {
    throw new ApiError(
      json?.meta?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }

  const parsed = schema.safeParse(json?.data);
  if (!parsed.success) {
    throw new ApiError("Unexpected response from the API.", res.status);
  }
  return parsed.data;
}

export const api = {
  getConfig(): Promise<AppConfig> {
    return apiRequest("/config", { schema: appConfigSchema });
  },

  listCampaigns(userId?: string): Promise<Campaign[]> {
    return apiRequest(`/campaigns${userId ? `?user_id=${userId}` : ""}`, {
      schema: z.array(campaignSchema),
    });
  },

  getCampaign(id: string): Promise<CampaignDetail> {
    return apiRequest(`/campaigns/${id}`, { schema: campaignDetailSchema });
  },

  register(input: {
    name: string;
    occupation: string;
    email: string;
    password: string;
  }): Promise<User> {
    return apiRequest("/users", {
      schema: userSchema,
      method: "POST",
      body: input,
    });
  },

  login(input: { email: string; password: string }): Promise<User> {
    return apiRequest("/sessions", {
      schema: userSchema,
      method: "POST",
      body: input,
    });
  },

  fetchUser(token: string): Promise<User> {
    return apiRequest("/users/fetch", { schema: userSchema, token });
  },

  createCampaign(
    token: string,
    input: {
      name: string;
      short_description: string;
      description: string;
      goal_amount: number;
      perks: string;
    },
  ): Promise<Campaign> {
    return apiRequest("/campaigns", {
      schema: campaignSchema,
      method: "POST",
      body: input,
      token,
    });
  },

  createTransaction(
    token: string,
    input: { amount: number; campaign_id: string },
  ): Promise<Transaction> {
    return apiRequest("/transactions", {
      schema: transactionSchema,
      method: "POST",
      body: input,
      token,
    });
  },

  listMyTransactions(token: string): Promise<UserTransaction[]> {
    return apiRequest("/transactions", {
      schema: z.array(userTransactionSchema),
      token,
    });
  },
};
