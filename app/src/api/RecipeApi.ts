export interface Recipe {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
}

const mockRecipes: Recipe[] = [
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
  },
  {
    id: '4',
    name: '水煮鱼',
    description: '麻辣鲜香的川菜代表，鱼肉鲜嫩。',
    category: '川菜',
    tags: ['麻辣', '下饭', '海鲜']
  },
  {
    id: '5',
    name: '鱼香肉丝',
    description: '咸甜酸辣的完美结合。',
    category: '川菜',
    tags: ['咸鲜', '下饭', '家常菜']
  },
  {
    id: '6',
    name: '辣子鸡',
    description: '香脆可口的川式小吃。',
    category: '川菜',
    tags: ['香辣', '小吃', '家常菜']
  }
];

export class RecipeApi {
  private static readonly baseUrl = '/api/recipes';

  static async list(): Promise<Recipe[]> {
    // const response = await fetch(this.baseUrl);
    // return response.json();
    return Promise.resolve(mockRecipes);
  }

  static async get(id: string): Promise<Recipe> {
    // const response = await fetch(`${this.baseUrl}/${id}`);
    // return response.json();
    const recipe = mockRecipes.find(r => r.id === id);
    if (!recipe) throw new Error('Recipe not found');
    return Promise.resolve(recipe);
  }

  static async random(): Promise<Recipe> {
    // const response = await fetch(`${this.baseUrl}/random`);
    // return response.json();
    const index = Math.floor(Math.random() * mockRecipes.length);
    return Promise.resolve(mockRecipes[index]);
  }
}
