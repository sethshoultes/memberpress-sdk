import { BaseService } from './base';
import { Transaction, TransactionStatus, TransactionType } from '../types';

export interface TransactionFilter {
  status?: TransactionStatus;
  type?: TransactionType;
  memberId?: number;
  subscriptionId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class TransactionService extends BaseService {
  async create(data: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>({
      method: 'POST',
      url: '/transactions',
      data,
    });
  }

  async get(id: number): Promise<Transaction> {
    return this.request<Transaction>({
      method: 'GET',
      url: `/transactions/${id}`,
    });
  }

  async list(filter?: TransactionFilter): Promise<Transaction[]> {
    return this.request<Transaction[]>({
      method: 'GET',
      url: '/transactions',
      params: filter,
    });
  }

  async refund(id: number, amount?: number): Promise<Transaction> {
    return this.request<Transaction>({
      method: 'POST',
      url: `/transactions/${id}/refund`,
      data: amount ? { amount } : undefined,
    });
  }

  async getByMember(memberId: number, filter?: Omit<TransactionFilter, 'memberId'>): Promise<Transaction[]> {
    return this.list({ ...filter, memberId });
  }

  async getBySubscription(subscriptionId: number, filter?: Omit<TransactionFilter, 'subscriptionId'>): Promise<Transaction[]> {
    return this.list({ ...filter, subscriptionId });
  }
}