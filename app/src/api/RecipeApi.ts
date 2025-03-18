import { getBackendApiUrl, isBackendAvailable } from '../utils/config';

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
    // If backend is not available, return mock data
    if (!isBackendAvailable()) {
      return Promise.resolve(mockRecipes);
    }

    try {
      const apiUrl = getBackendApiUrl();
      const response = await fetch(`${apiUrl}${this.baseUrl}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return mockRecipes; // Fallback to mock data
    }
  }

  static async get(id: string): Promise<Recipe> {
    // If backend is not available, return mock data
    if (!isBackendAvailable()) {
      const recipe = mockRecipes.find(r => r.id === id);
      if (!recipe) throw new Error('Recipe not found');
      return Promise.resolve(recipe);
    }

    try {
      const apiUrl = getBackendApiUrl();
      const response = await fetch(`${apiUrl}${this.baseUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Recipe not found');
        }
        throw new Error(`Failed to fetch recipe: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      // Try to find in mock data as fallback
      const recipe = mockRecipes.find(r => r.id === id);
      if (!recipe) throw new Error('Recipe not found');
      return recipe;
    }
  }

  static async random(): Promise<Recipe> {
    // If backend is not available, return random mock data
    if (!isBackendAvailable()) {
      const index = Math.floor(Math.random() * mockRecipes.length);
      return Promise.resolve(mockRecipes[index]);
    }

    try {
      const apiUrl = getBackendApiUrl();
      const response = await fetch(`${apiUrl}${this.baseUrl}/random`);
      if (!response.ok) {
        throw new Error(`Failed to fetch random recipe: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching random recipe:', error);
      // Fallback to mock data
      const index = Math.floor(Math.random() * mockRecipes.length);
      return mockRecipes[index];
    }
  }
}
