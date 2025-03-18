import { getBackendApiUrl, isBackendAvailable } from '../utils/config';

export interface Block {
  padding: string;
  background: string;
}

export interface Prize {
  background: string;
  fonts: Array<{
    text: string;
    top: string;
  }>;
}

export interface Button {
  radius: string;
  background: string;
  pointer?: boolean;
  fonts?: Array<{
    text: string;
    top: string;
  }>;
}

export interface ShakeConfig {
  blocks: Block[];
  prizes: Prize[];
  buttons: Button[];
}

// Default shake configuration for when backend is not available
const defaultConfig: ShakeConfig = {
  blocks: [{ padding: '10px', background: '#869cfa' }],
  prizes: [
    { background: '#e9e8fe', fonts: [{ text: '麻婆豆腐', top: '10%' }] },
    { background: '#b8c5f2', fonts: [{ text: '回锅肉', top: '10%' }] },
    { background: '#e9e8fe', fonts: [{ text: '宫保鸡丁', top: '10%' }] },
    { background: '#b8c5f2', fonts: [{ text: '水煮鱼', top: '10%' }] },
    { background: '#e9e8fe', fonts: [{ text: '鱼香肉丝', top: '10%' }] },
    { background: '#b8c5f2', fonts: [{ text: '辣子鸡', top: '10%' }] }
  ],
  buttons: [
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc4f8' },
    {
      radius: '30%',
      background: '#869cfa',
      pointer: true,
      fonts: [{ text: '摇一摇', top: '1%' }]
    }
  ]
};

export class ShakeApi {
  private static readonly baseUrl = '/api/shake';

  static async getConfig(): Promise<ShakeConfig> {
    // If backend is not available, return default config
    if (!isBackendAvailable()) {
      return Promise.resolve(defaultConfig);
    }

    try {
      const apiUrl = getBackendApiUrl();
      const response = await fetch(`${apiUrl}${this.baseUrl}/config`);
      if (!response.ok) {
        throw new Error(`Failed to fetch shake config: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching shake config:', error);
      return defaultConfig; // Fallback to default config
    }
  }
}
