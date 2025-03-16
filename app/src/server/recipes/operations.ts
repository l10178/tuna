import { Recipe } from 'wasp/entities'
import { GetRecipes, GetRandomRecipe } from 'wasp/server/operations'

export const getRecipes: GetRecipes = async (_args, context) => {
    return context.entities.Recipe.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export const getRandomRecipe: GetRandomRecipe = async (_args, context) => {
    const count = await context.entities.Recipe.count()
    const skip = Math.floor(Math.random() * count)
    const recipes = await context.entities.Recipe.findMany({
        take: 1,
        skip: skip
    })
    return recipes[0]
} 