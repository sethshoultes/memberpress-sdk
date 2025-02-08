import { SubscriptionService } from '../subscription';
import { SDKConfig, Subscription, SubscriptionStatus } from '../../types';

describe('SubscriptionService', () => {
  const config: SDKConfig = {
    apiKey: 'test-api-key',
    baseUrl: 'https://test.com/wp-json/mp/v1',
  };

  const mockSubscription: Subscription = {
    id: 1,
    memberId: 1,
    planId: 1,
    status: 'active',
    startDate: '2024-02-20T00:00:00Z',
    endDate: '2025-02-20T00:00:00Z',
    renewalDate: '2024-03-20T00:00:00Z',
    paymentMethod: {
      id: 1,
      type: 'credit_card',
      lastFour: '4242',
      expiryDate: '2025-12',
    },
  };

  let service: SubscriptionService;

  beforeEach(() => {
    service = new SubscriptionService(config);
  });

  describe('create', () => {
    it('should create a new subscription', async () => {
      const response = await service.create({
        memberId: mockSubscription.memberId,
        planId: mockSubscription.planId,
      });

      expect(response).toEqual(mockSubscription);
    });
  });

  describe('get', () => {
    it('should get a subscription by id', async () => {
      const response = await service.get(1);
      expect(response).toEqual(mockSubscription);
    });

    it('should throw error for non-existent subscription', async () => {
      await expect(service.get(999)).rejects.toThrow('Not Found');
    });
  });

  describe('update', () => {
    it('should update a subscription', async () => {
      const updates = { planId: 2 };
      const response = await service.update(1, updates);
      expect(response).toEqual({ ...mockSubscription, ...updates });
    });
  });

  describe('status management', () => {
    it('should pause a subscription', async () => {
      const response = await service.pause(1);
      expect(response).toEqual({ ...mockSubscription, status: 'paused' });
    });

    it('should resume a subscription', async () => {
      const response = await service.resume(1);
      expect(response).toEqual({ ...mockSubscription, status: 'active' });
    });

    it('should cancel a subscription', async () => {
      const response = await service.cancel(1);
      expect(response).toEqual({ ...mockSubscription, status: 'cancelled' });
    });
  });

  describe('list', () => {
    it('should list subscriptions with filters', async () => {
      const filters = { status: 'active' as SubscriptionStatus, memberId: 1, page: 1, limit: 10 };
      const response = await service.list(filters);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0]).toEqual(mockSubscription);
    });
  });
});