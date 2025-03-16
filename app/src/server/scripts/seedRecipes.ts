import { PrismaClient } from '@prisma/client'

export const seedRecipes = async (prisma: PrismaClient) => {
    console.log('🌱 Seeding recipes...')

    const recipesCount = await prisma.recipe.count()
    if (recipesCount > 0) {
        console.log('Recipes already seeded')
        return
    }

    const recipes = [
        {
            name: '红烧肉',
            description: '经典家常菜，肥而不腻',
            category: '中餐',
            tags: ['肉类', '家常菜', '下饭']
        },
        {
            name: '宫保鸡丁',
            description: '麻辣鲜香，下饭神器',
            category: '中餐',
            tags: ['鸡肉', '辣', '快手菜']
        },
        {
            name: '水煮鱼',
            description: '麻辣鲜香，鱼肉鲜嫩',
            category: '川菜',
            tags: ['鱼类', '辣', '下饭']
        },
        {
            name: '意大利面',
            description: '简单美味的西餐选择',
            category: '西餐',
            tags: ['面食', '快手菜', '西餐']
        },
        {
            name: '披萨',
            description: '外酥里嫩，奶香浓郁',
            category: '西餐',
            tags: ['奶酪', '烘焙', '西餐']
        },
        {
            name: '寿司',
            description: '新鲜的海鲜与米饭的完美结合',
            category: '日料',
            tags: ['海鲜', '生食', '日料']
        },
        {
            name: '汉堡',
            description: '美式快餐经典',
            category: '西餐',
            tags: ['快餐', '肉类', '西餐']
        },
        {
            name: '沙拉',
            description: '健康低卡路里选择',
            category: '轻食',
            tags: ['蔬菜', '健康', '低卡']
        },
        {
            name: '火锅',
            description: '热气腾腾，适合聚餐',
            category: '中餐',
            tags: ['聚餐', '辣', '冬季']
        },
        {
            name: '烤肉',
            description: '香气四溢，肉香浓郁',
            category: '烧烤',
            tags: ['肉类', '聚餐', '烧烤']
        }
    ]

    for (const recipe of recipes) {
        await prisma.recipe.create({
            data: recipe
        })
    }

    console.log(`✅ Successfully seeded ${recipes.length} recipes`)
} 