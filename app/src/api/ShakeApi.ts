export interface ShakeConfig {
  blocks: Array<{
    padding?: string;
    background?: string;
  }>;
  prizes: Array<{
    id: number;
    name: string;
    background?: string;
  }>;
  buttons: Array<{
    radius?: string;
    background?: string;
  }>;
}

export class ShakeApi {
  private static readonly baseUrl = '/api/shake';

  static async getConfig(): Promise<ShakeConfig> {
    return {
      blocks: [{ padding: '10px', background: '#869cfa' }],
      prizes: [
        { id: 1, name: '麻婆豆腐', background: '#e9e8fe' },
        { id: 2, name: '回锅肉', background: '#b8c5f2' },
        { id: 3, name: '水煮鱼', background: '#e9e8fe' },
        { id: 4, name: '宫保鸡丁', background: '#b8c5f2' },
        { id: 5, name: '鱼香肉丝', background: '#e9e8fe' },
        { id: 6, name: '辣子鸡', background: '#b8c5f2' },
      ],
      buttons: [{ radius: '35px', background: '#617df2' }],
    };
  }
}
