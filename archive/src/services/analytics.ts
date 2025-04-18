import { BaseService } from './base';
import { DateRange, RevenueMetrics, EngagementMetrics, ChurnMetrics } from '../types';

export interface AnalyticsFilter extends DateRange {
  interval?: 'day' | 'week' | 'month' | 'year';
  memberId?: number;
  planId?: number;
}

export class AnalyticsService extends BaseService {
  async getRevenue(filter?: AnalyticsFilter): Promise<RevenueMetrics> {
    return this.request<RevenueMetrics>({
      method: 'GET',
      url: '/analytics/revenue',
      params: filter,
    });
  }

  async getEngagement(filter?: AnalyticsFilter): Promise<EngagementMetrics> {
    return this.request<EngagementMetrics>({
      method: 'GET',
      url: '/analytics/engagement',
      params: filter,
    });
  }

  async getChurnRate(filter?: AnalyticsFilter): Promise<ChurnMetrics> {
    return this.request<ChurnMetrics>({
      method: 'GET',
      url: '/analytics/churn',
      params: filter,
    });
  }

  async getMemberGrowth(filter?: AnalyticsFilter): Promise<{
    total: number;
    growth: number;
    history: Array<{ date: string; count: number }>;
  }> {
    return this.request({
      method: 'GET',
      url: '/analytics/member-growth',
      params: filter,
    });
  }

  async getSubscriptionMetrics(filter?: AnalyticsFilter): Promise<{
    activeSubscriptions: number;
    trialConversions: number;
    upgrades: number;
    downgrades: number;
    history: Array<{
      date: string;
      active: number;
      trials: number;
      conversions: number;
    }>;
  }> {
    return this.request({
      method: 'GET',
      url: '/analytics/subscriptions',
      params: filter,
    });
  }
}