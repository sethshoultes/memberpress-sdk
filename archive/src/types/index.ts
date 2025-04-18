export interface SDKConfig {
  apiKey: string;
  baseUrl: string;
  cacheTimeout?: number;
  rateLimitRequests?: number;
  debug?: boolean;
}

export interface Member {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  status: MemberStatus;
  subscriptions: Subscription[];
  createdAt: string;
  updatedAt: string;
}

export type MemberStatus = 'active' | 'inactive' | 'pending' | 'cancelled';

export interface Subscription {
  id: number;
  memberId: number;
  planId: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  paymentMethod: PaymentMethod;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';

export interface PaymentMethod {
  id: number;
  type: string;
  lastFour?: string;
  expiryDate?: string;
}

export interface Transaction {
  id: number;
  memberId: number;
  subscriptionId: number;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
}

export type TransactionStatus = 'completed' | 'failed' | 'refunded' | 'pending';
export type TransactionType = 'payment' | 'refund' | 'subscription' | 'upgrade' | 'downgrade';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface RevenueMetrics {
  total: number;
  recurring: number;
  oneTime: number;
  currency: string;
  history: Array<{
    date: string;
    amount: number;
  }>;
}

export interface EngagementMetrics {
  activeMembers: number;
  averageSessionDuration: number;
  totalSessions: number;
  history: Array<{
    date: string;
    sessions: number;
  }>;
}

export interface ChurnMetrics {
  rate: number;
  total: number;
  voluntary: number;
  involuntary: number;
  history: Array<{
    date: string;
    rate: number;
  }>;
}