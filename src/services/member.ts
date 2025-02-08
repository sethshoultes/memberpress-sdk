import { BaseService } from './base';
import { Member, MemberStatus } from '../types';

export interface MemberFilter {
  status?: MemberStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export class MemberService extends BaseService {
  async create(data: Partial<Member>): Promise<Member> {
    return this.request<Member>({
      method: 'POST',
      url: '/members',
      data,
    });
  }

  async get(id: number): Promise<Member> {
    return this.request<Member>({
      method: 'GET',
      url: `/members/${id}`,
    });
  }

  async update(id: number, data: Partial<Member>): Promise<Member> {
    return this.request<Member>({
      method: 'PUT',
      url: `/members/${id}`,
      data,
    });
  }

  async delete(id: number): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/members/${id}`,
    });
  }

  async list(filter?: MemberFilter): Promise<Member[]> {
    return this.request<Member[]>({
      method: 'GET',
      url: '/members',
      params: filter,
    });
  }

  async updateStatus(id: number, status: MemberStatus): Promise<Member> {
    return this.request<Member>({
      method: 'PATCH',
      url: `/members/${id}/status`,
      data: { status },
    });
  }

  async bulkUpdate(ids: number[], data: Partial<Member>): Promise<Member[]> {
    return this.request<Member[]>({
      method: 'PUT',
      url: '/members/bulk',
      data: { ids, ...data },
    });
  }
}