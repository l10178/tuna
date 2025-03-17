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

export class ShakeApi {
  private static readonly baseUrl = '/api/shake';

  static async getConfig(): Promise<ShakeConfig> {
    return {
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
          fonts: [{ text: '开始', top: '10%' }]
        }
      ],
    };
  }
}
