type Recipe = {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
}

interface ShakeConfig {
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

export const getShakeConfig = (): ShakeConfig => ({
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
});

export const getRecipes = (): Recipe[] => [
  {
    id: '1',
    name: '麻婆豆腐',
    description: '四川传统名菜，麻辣鲜香的代表作。',
    category: '川菜',
    tags: ['麻辣', '下饭', '家常菜']
  },
  {
    id: '2',
    name: '回锅肉',
    description: '四川传统名菜，鲜嫩的肉片。',
    category: '川菜',
    tags: ['香辣', '下饭', '家常菜']
  },
  {
    id: '3',
    name: '宫保鸡丁',
    description: '鸡肉丁配以花生、青红椒等烹制。',
    category: '川菜',
    tags: ['香辣', '下饭', '家常菜']
  }
];

export const randomRecipe = (recipes: Recipe[]): Recipe => {
  const index = Math.floor(Math.random() * recipes.length);
  return recipes[index];
};
