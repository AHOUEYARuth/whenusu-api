/* eslint-disable prettier/prettier */

import Category from "#models/category";

export class CategoryService {

  async createCategory(data: any, userId: string) {
    const category = new Category()
    category.name = data.name
    category.createdBy = userId
    await category.save()
    return category
  }

  async updateCategory(categoryId: string, data: any) {
    const category = await Category.query().where('id', categoryId).firstOrFail()
    const message = 'Categorie non trouvée'
    if (!category) {
      return message
    }
    category.name = data.name || category.name
    await category.save()
    return category
  }

  async getCategories() {
    const categories = await Category.all()
    return categories
  }

  async deleteCategory(categoryId: string) {
    const category = await Category.query().where('id', categoryId).firstOrFail()
    const message = 'Categorie non trouvée'
    if (!category) {
      /* throw new Error('Categorie non trouvée') */
      return message
    }
    await category.delete()
  }
}