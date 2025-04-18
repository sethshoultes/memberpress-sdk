import { MemberService } from '../member';
import { SDKConfig, Member, MemberStatus } from '../../types';

describe('MemberService', () => {
  const config: SDKConfig = {
    apiKey: 'test-api-key',
    baseUrl: 'https://test.com/wp-json/mp/v1',
  };

  const mockMember: Member = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    status: 'active',
    subscriptions: [],
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  };

  let service: MemberService;

  beforeEach(() => {
    service = new MemberService(config);
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const response = await service.create({
        email: mockMember.email,
        firstName: mockMember.firstName,
        lastName: mockMember.lastName,
      });

      expect(response).toEqual(mockMember);
    });
  });

  describe('get', () => {
    it('should get a member by id', async () => {
      const response = await service.get(1);
      expect(response).toEqual(mockMember);
    });

    it('should throw error for non-existent member', async () => {
      await expect(service.get(999)).rejects.toThrow('Not Found');
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const updates = { firstName: 'Updated' };
      const response = await service.update(1, updates);
      expect(response).toEqual({ ...mockMember, ...updates });
    });
  });

  describe('updateStatus', () => {
    it('should update member status', async () => {
      const newStatus: MemberStatus = 'inactive';
      const response = await service.updateStatus(1, newStatus);
      expect(response).toEqual({ ...mockMember, status: newStatus });
    });
  });

  describe('list', () => {
    it('should list members with filters', async () => {
      const filters = { status: 'active' as MemberStatus, page: 1, limit: 10 };
      const response = await service.list(filters);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0]).toEqual(mockMember);
    });
  });
});