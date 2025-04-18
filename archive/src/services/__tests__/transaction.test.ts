import { TransactionService } from '../transaction';
import { SDKConfig, Transaction } from '../../types';

describe('TransactionService', () => {
  const config: SDKConfig = {
    apiKey: 'test-api-key',
    baseUrl: 'https://test.com/wp-json/mp/v1',
  };

  const mockTransaction: Transaction = {
    id: 1,
    memberId: 1,
    subscriptionId: 1,
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
    type: 'payment',
    createdAt: '2024-02-20T00:00:00Z',
  };

  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService(config);
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const response = await service.create({
        memberId: mockTransaction.memberId,
        subscriptionId: mockTransaction.subscriptionId,
        amount: mockTransaction.amount,
        currency: mockTransaction.currency,
      });

      expect(response).toEqual(mockTransaction);
    });
  });

  describe('get', () => {
    it('should get a transaction by id', async () => {
      const response = await service.get(1);
      expect(response).toEqual(mockTransaction);
    });

    it('should throw error for non-existent transaction', async () => {
      await expect(service.get(999)).rejects.toThrow('Not Found');
    });
  });

  describe('refund', () => {
    it('should process a full refund', async () => {
      const response = await service.refund(1);
      expect(response).toEqual({
        ...mockTransaction,
        type: 'refund',
        status: 'completed',
      });
    });

    it('should process a partial refund', async () => {
      const partialAmount = 50;
      const response = await service.refund(1, partialAmount);
      expect(response).toEqual({
        ...mockTransaction,
        type: 'refund',
        status: 'completed',
        amount: partialAmount,
      });
    });
  });

  describe('list', () => {
    it('should list transactions with filters', async () => {
      const filters = {
        status: 'completed',
        type: 'payment',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        page: 1,
        limit: 10,
      };
      const response = await service.list(filters);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0]).toEqual(mockTransaction);
    });
  });

  describe('member transactions', () => {
    it('should get transactions for a specific member', async () => {
      const response = await service.getByMember(1);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0].memberId).toBe(1);
    });
  });

  describe('subscription transactions', () => {
    it('should get transactions for a specific subscription', async () => {
      const response = await service.getBySubscription(1);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0].subscriptionId).toBe(1);
    });
  });
});