
export interface Policy {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  enabled: boolean;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export class PolicyApi {
  private static readonly baseUrl = '/api/policies';

  static async list(): Promise<Policy[]> {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  static async get(id: string): Promise<Policy> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    return response.json();
  }

  static async create(policy: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Policy> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy)
    });
    return response.json();
  }

  static async update(id: string, policy: Partial<Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Policy> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policy)
    });
    return response.json();
  }

  static async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
  }

  static async shake(count: number = 1): Promise<Policy[]> {
    const response = await fetch(`${this.baseUrl}/shake?count=${count}`);
    return response.json();
  }
}
