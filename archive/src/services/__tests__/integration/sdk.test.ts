import { MemberPressSDK } from '../../../index';
import { Member, Subscription, Transaction } from '../../../types';

describe('MemberPress SDK Integration', () => {
  const sdk = new MemberPressSDK({
    apiKey: process.env.MP_API_KEY || 'test-api-key',
    baseUrl: process.env.MP_API_URL || 'https://test.com/wp-json/mp/v1',
  });

  let testMember: Member;
  let testSubscription: Subscription;
  let testTransaction: Transaction;

  describe('Member Flow', () => {
    it('should create and manage a member', async () => {
      // Create member
      testMember = await sdk.members.create({
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
      });
      expect(testMember.id).toBeDefined();

      // Update member
      const updatedMember = await sdk.members.update(testMember.id, {
        firstName: 'Updated',
      });
      expect(updatedMember.firstName).toBe('Updated');

      // Get member
      const fetchedMember = await sdk.members.get(testMember.id);
      expect(fetchedMember).toEqual(updatedMember);
    });
  });

  describe('Subscription Flow', () => {
    it('should manage member subscriptions', async () => {
      // Create subscription
      testSubscription = await sdk.subscriptions.create({
        memberId: testMember.id,
        planId: 1,
      });
      expect(testSubscription.id).toBeDefined();

      // Pause subscription
      const pausedSubscription = await sdk.subscriptions.pause(testSubscription.id);
      expect(pausedSubscription.status).toBe('paused');

      // Resume subscription
      const resumedSubscription = await sdk.subscriptions.resume(testSubscription.id);
      expect(resumedSubscription.status).toBe('active');
    });
  });

  describe('Transaction Flow', () => {
    it('should process transactions', async () => {
      // Create transaction
      testTransaction = await sdk.transactions.create({
        memberId: testMember.id,
        subscriptionId: testSubscription.id,
        amount: 99.99,
        currency: 'USD',
      });
      expect(testTransaction.id).toBeDefined();

      // Process refund
      const refund = await sdk.transactions.refund(testTransaction.id, 50);
      expect(refund.type).toBe('refund');
      expect(refund.amount).toBe(50);
    });
  });

  describe('Analytics Flow', () => {
    it('should fetch analytics data', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      // Revenue metrics
      const revenue = await sdk.analytics.getRevenue({ startDate, endDate });
      expect(revenue.total).toBeDefined();

      // Engagement metrics
      const engagement = await sdk.analytics.getEngagement({ startDate, endDate });
      expect(engagement.activeMembers).toBeDefined();

      // Churn metrics
      const churn = await sdk.analytics.getChurnRate({ startDate, endDate });
      expect(churn.rate).toBeDefined();
    });
  });

  // Cleanup
  afterAll(async () => {
    if (testMember?.id) {
      await sdk.members.delete(testMember.id);
    }
  });
});