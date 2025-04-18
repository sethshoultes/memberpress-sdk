import { AnalyticsService } from '../analytics';
import { SDKConfig } from '../../types';

describe('AnalyticsService', () => {
  const config: SDKConfig = {
    apiKey: 'test-api-key',
    baseUrl: 'https://test.com/wp-json/mp/v1',
  };

  const mockRevenueData = {
    total: 50000,
    recurring: 45000,
    oneTime: 5000,
    currency: 'USD',
    history: [
      { date: '2024-02-01', amount: 15000 },
      { date: '2024-02-02', amount: 17000 },
      { date: '2024-02-03', amount: 18000 },
    ],
  };

  const mockEngagementData = {
    activeMembers: 1000,
    averageSessionDuration: 1800,
    totalSessions: 5000,
    history: [
      { date: '2024-02-01', sessions: 1600 },
      { date: '2024-02-02', sessions: 1700 },
      { date: '2024-02-03', sessions: 1700 },
    ],
  };

  const mockChurnData = {
    rate: 0.05,
    total: 50,
    voluntary: 30,
    involuntary: 20,
    history: [
      { date: '2024-02-01', rate: 0.04 },
      { date: '2024-02-02', rate: 0.05 },
      { date: '2024-02-03', rate: 0.06 },
    ],
  };

  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService(config);
  });

  describe('getRevenue', () => {
    it('should get revenue metrics', async () => {
      const response = await service.getRevenue({
        startDate: '2024-02-01',
        endDate: '2024-02-03',
      });
      expect(response).toEqual(mockRevenueData);
    });
  });

  describe('getEngagement', () => {
    it('should get engagement metrics', async () => {
      const response = await service.getEngagement({
        startDate: '2024-02-01',
        endDate: '2024-02-03',
      });
      expect(response).toEqual(mockEngagementData);
    });
  });

  describe('getChurnRate', () => {
    it('should get churn metrics', async () => {
      const response = await service.getChurnRate({
        startDate: '2024-02-01',
        endDate: '2024-02-03',
      });
      expect(response).toEqual(mockChurnData);
    });
  });

  describe('getMemberGrowth', () => {
    it('should get member growth metrics', async () => {
      const response = await service.getMemberGrowth({
        startDate: '2024-02-01',
        endDate: '2024-02-03',
      });
      expect(response).toHaveProperty('total');
      expect(response).toHaveProperty('growth');
      expect(response).toHaveProperty('history');
    });
  });

  describe('getSubscriptionMetrics', () => {
    it('should get subscription metrics', async () => {
      const response = await service.getSubscriptionMetrics({
        startDate: '2024-02-01',
        endDate: '2024-02-03',
      });
      expect(response).toHaveProperty('activeSubscriptions');
      expect(response).toHaveProperty('trialConversions');
      expect(response).toHaveProperty('upgrades');
      expect(response).toHaveProperty('downgrades');
      expect(response).toHaveProperty('history');
    });
  });
});