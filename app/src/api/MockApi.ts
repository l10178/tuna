import { ANONYMOUS_USER_ID, Application, Dataset } from './Modules';

// 默认应用列表，当没有本地存储数据时使用
export const defaultApplications: Application[] = [
  {
    id: 'anonymous01',
    name: '知春里午餐摇一摇',
    description: '中午去哪吃，知春里午餐摇一摇是一款基于AI的智能推荐应用，可以根据用户的口味和偏好推荐午餐。',
    createdBy: ANONYMOUS_USER_ID,
    datasetId: 'anonymousDataset01'
  }
];

export const anonymousDataset01: Dataset = {
  id: 'anonymousdataset01',
  name: '知春里午餐数据集',
  createdBy: ANONYMOUS_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: '知春里午餐数据集',
  datas: [
    {
      id: 'dish01',
      name: '宫保鸡丁',
      description: '经典川菜，鸡肉丁与花生米炒制而成。',
      category: '美食',
      tags: ['川菜', '鸡肉', '花生']
    },
    {
      id: 'dish02',
      name: '鱼香肉丝',
      description: '川菜代表菜品，酸甜适口，肉丝嫩滑。',
      category: '美食',
      tags: ['川菜', '猪肉', '酸甜']
    },
    {
      id: 'dish03',
      name: '麻婆豆腐',
      description: '麻辣鲜香，豆腐嫩滑，川菜经典。',
      category: '美食',
      tags: ['川菜', '豆腐', '麻辣']
    },
    {
      id: 'dish04',
      name: '回锅肉',
      description: '川菜经典，肥而不腻，香辣可口。',
      category: '美食',
      tags: ['川菜', '猪肉', '香辣']
    },
    {
      id: 'dish05',
      name: '水煮鱼',
      description: '麻辣鲜香，鱼肉嫩滑，川菜代表。',
      category: '美食',
      tags: ['川菜', '鱼', '麻辣']
    },
    {
      id: 'dish06',
      name: '辣子鸡',
      description: '川菜经典，鸡肉香辣，口感丰富。',
      category: '美食',
      tags: ['川菜', '鸡肉', '香辣']
    },
    {
      id: 'dish07',
      name: '红烧肉',
      description: '肥而不腻，入口即化，经典家常菜。',
      category: '美食',
      tags: ['家常菜', '猪肉', '红烧']
    },
    {
      id: 'dish08',
      name: '糖醋里脊',
      description: '酸甜可口，外酥里嫩，经典家常菜。',
      category: '美食',
      tags: ['家常菜', '猪肉', '酸甜']
    },
    {
      id: 'dish09',
      name: '京酱肉丝',
      description: '京味经典，酱香浓郁，肉丝嫩滑。',
      category: '美食',
      tags: ['京菜', '猪肉', '酱香']
    },
    {
      id: 'dish10',
      name: '蚝油牛肉',
      description: '蚝油香浓，牛肉嫩滑，经典粤菜。',
      category: '美食',
      tags: ['粤菜', '牛肉', '蚝油']
    }

  ]
};

export const defaultPrizeList = [
  { background: '#e9e8fe', fonts: [{ text: '麻婆豆腐', top: '10%' }] },
  { background: '#b8c5f2', fonts: [{ text: '回锅肉', top: '10%' }] },
  { background: '#e9e8fe', fonts: [{ text: '宫保鸡丁', top: '10%' }] },
  { background: '#b8c5f2', fonts: [{ text: '水煮鱼', top: '10%' }] },
  { background: '#e9e8fe', fonts: [{ text: '鱼香肉丝', top: '10%' }] },
  { background: '#b8c5f2', fonts: [{ text: '辣子鸡', top: '10%' }] }
];
