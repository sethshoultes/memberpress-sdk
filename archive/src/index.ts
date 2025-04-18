import { SDKConfig } from './types';
import { MemberService } from './services/member';
import { SubscriptionService } from './services/subscription';
import { TransactionService } from './services/transaction';
import { AnalyticsService } from './services/analytics';

export class MemberPressSDK {
  public readonly members: MemberService;
  public readonly subscriptions: SubscriptionService;
  public readonly transactions: TransactionService;
  public readonly analytics: AnalyticsService;

  constructor(config: SDKConfig) {
    this.validateConfig(config);
    this.members = new MemberService(config);
    this.subscriptions = new SubscriptionService(config);
    this.transactions = new TransactionService(config);
    this.analytics = new AnalyticsService(config);
  }

  private validateConfig(config: SDKConfig): void {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    if (!config.baseUrl) {
      throw new Error('Base URL is required');
    }
  }
}

export * from './types';