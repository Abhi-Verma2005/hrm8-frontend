import { apiClient } from "./api";

export type UpgradeTier = "shortlisting" | "full_service" | "executive_search";

type CheckoutResponse = {
  checkoutUrl: string;
  sessionId: string;
};

export async function createUpgradeCheckoutSession(params: {
  tier: UpgradeTier;
  companyId: string;
  customerEmail?: string;
}) {
  return apiClient.post<CheckoutResponse>("/api/payments/upgrade-checkout", params);
}


