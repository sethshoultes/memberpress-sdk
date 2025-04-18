import { BaseService } from './base';
import { Subscription, SubscriptionStatus } from '../types';

export interface SubscriptionFilter {
  status?: SubscriptionStatus;
  memberId?: number;
  planId?: number;
  page?: number;
  limit?: number;
}

export class SubscriptionService extends BaseService {
  async create(data: Partial<Subscription>): Promise<Subscription> {
    return this.request<Subscription>({
      method: 'POST',
      url: '/subscriptions',
      data,
    });
  }

  async get(id: number): Promise<Subscription> {
    return this.request<Subscription>({
      method: 'GET',
      url: `/subscriptions/${id}`,
    });
  }

  async update(id: number, data: Partial<Subscription>): Promise<Subscription> {
    return this.request<Subscription>({
      method: 'PUT',
      url: `/subscriptions/${id}`,
      data,
    });
  }

  async delete(id: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/subscriptions/${id}`,
    });
  }

  async list(filter?: SubscriptionFilter): Promise<Subscription[]> {
    return this.request<Subscription[]>({
      method: 'GET',
      url: '/subscriptions',
      params: filter,
    });
  }

  async updateStatus(id: number, status: SubscriptionStatus): Promise<Subscription> {
    return this.request<Subscription>({
      method: 'PATCH',
      url: `/subscriptions/${id}/status`,
      data: { status },
    });
  }

  async pause(id: number): Promise<Subscription> {
    return this.updateStatus(id, 'paused');
  }

  async resume(id: number): Promise<Subscription> {
    return this.updateStatus(id, 'active');
  }

  async cancel(id: number): Promise<Subscription> {
    return this.updateStatus(id, 'cancelled');
  }
}