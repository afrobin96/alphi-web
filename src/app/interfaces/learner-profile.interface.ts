export interface LearnerProfile {
  id: number;
  username: string;
  role: string;
  subscriptionPlan: string;
  subscriptionExpiresAt: string | null;
  dailyTokensUsed: number;
  dailyLimit: number;
  monthlyTokensUsed: number;
  monthlyLimit: number;
  createdAt: string;
}
