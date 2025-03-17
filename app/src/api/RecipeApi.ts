interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
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
    description: '四川传统名菜，以豆腐、肉末为主料，配以豆瓣酱、花椒等调味料烹制而成。',
    ingredients: ['豆腐', '猪肉末', '豆瓣酱', '花椒', '葱花'],
    steps: [
      '豆腐切块，猪肉末腌制',
      '热油爆香豆瓣酱',
      '加入肉末翻炒',
      '加入豆腐块',
      '调味后撒上花椒粉和葱花'
    ]
  },
  {
    id: '2',
    name: '回锅肉',
    description: '四川传统名菜，将煮熟的猪肉回锅爆炒，加入青椒等配料。',
    ingredients: ['五花肉', '青椒', '蒜苗', '豆瓣酱'],
    steps: [
      '五花肉切片',
      '青椒、蒜苗切段',
      '热锅爆香豆瓣酱',
      '加入肉片翻炒',
      '加入配菜翻炒'
    ]
  }
];

export const randomRecipe = (recipes: Recipe[]): Recipe => {
  const index = Math.floor(Math.random() * recipes.length);
  return recipes[index];
};
